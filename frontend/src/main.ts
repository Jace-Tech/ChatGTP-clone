import bot from "../assets/bot.svg";
import user from "../assets/user.svg";

const messageBox = document.querySelector<HTMLDivElement>("#chat_container");
const form = document.querySelector<HTMLFormElement>("form");
const CHAT_BOT_URL = "https://chatbot-api-nusx.onrender.com";

const generateID = () => {
  const timestamp = Date.now().toString();
  const randomNumber = Math.random() * 10000;
  const hex = randomNumber.toString(16);
  return "chat-" + timestamp + hex + randomNumber.toString();
};

const generateChat = (message: any, isAI: boolean, id: string) => {
  const messageNode = document.createElement("div");
  messageNode.innerHTML = `
  <div class="wrapper ${isAI && "ai"}">
    <div class="chat">
      <div class="profile">
        <img src="${isAI ? bot : user}" alt="">
      </div>
      <div class="message" id="${id}">${message}</div>
    </div>
  </div>
`;
  return messageNode;
};

const handleThinking = (element: HTMLElement) => {
  element.innerHTML = "";
  const interval = setInterval(() => {
    if (element.innerHTML.length >= 3) element.innerHTML = "";
    element.innerHTML += ".";
  }, 300);

  return interval;
};

const handleTypeChat = (element: HTMLElement, text: string) => {
  element.innerHTML = "";

  let currentIndex = 0;
  const interval = setInterval(() => {
    if (currentIndex >= text.length) return clearInterval(interval);
    element.innerHTML += text.charAt(currentIndex);
    currentIndex++;
    handleScrollDown();
  }, 20);
};

const handleScrollDown = () =>
  messageBox?.scrollTo({
    top: messageBox.scrollHeight,
    left: 0,
    behavior: "smooth",
  });

const handleFormSubmit = async () => {
  const formData = new FormData(form as HTMLFormElement);
  if(!formData.get("message")) return
  // Add the users chat
  messageBox?.append(
    generateChat(formData.get("message"), false, generateID())
  );

  // Add a thinking bar
  const id = generateID();
  messageBox?.append(generateChat("...", true, id));
  const chatDiv = document.getElementById(id) as HTMLElement;

  const interval = handleThinking(chatDiv);

  // Get bot message
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: formData.get("message") }),
  };
  try {
    const request = await fetch(CHAT_BOT_URL, options);
    const { data: text, error } = await request.json();

    // handle Errors
    if (error) {
      clearInterval(interval);
      chatDiv.innerHTML = "Sorry something went wrong. Please try again";
      console.log(error);
      handleScrollDown();
      return;
    }

    // Remove the thinking bar
    clearInterval(interval);

    // Type in the chats
    handleTypeChat(chatDiv, text.trim() as string);

    // Scroll down
    handleScrollDown();

    // Reset Form
    form?.reset();
  } catch (error) {
    clearInterval(interval);
    chatDiv.innerHTML = "Sorry something went wrong. Please try again";
    console.log(error);
    handleScrollDown();
    return;
  }
};

form?.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  handleFormSubmit();
});
form?.addEventListener("keyup", (event: KeyboardEvent) => {
  if (event.key.toLowerCase() == "enter") {
    event.preventDefault();
    handleFormSubmit();
  }
});
