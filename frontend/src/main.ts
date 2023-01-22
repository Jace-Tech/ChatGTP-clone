import bot from "../assets/bot.svg";
import user from "../assets/user.svg";
// import Toastify from "toastify-js"
import Toastify from "toastify-js"

const messageBox = document.querySelector<HTMLDivElement>("#chat_container");
const messageInput = document.querySelector<HTMLTextAreaElement>("textarea")!
const form = document.querySelector<HTMLFormElement>("form")!;
const CHAT_BOT_URL = "https://chatbot-api-nusx.onrender.com";

type MessageStoreType = {
  id: string;
  type: string;
  message: string
}

const STORE_NAME = 'BOT_STORE'
const commandStack: string[] = []
let currentStackIndex = -1

const sleep = (time: number = 200) => Promise.resolve(() => setTimeout(() => true, time))

const generateID = () => {
  const timestamp = Date.now().toString();
  const randomNumber = Math.random() * 10000;
  const hex = randomNumber.toString(16);
  return "chat-" + timestamp + hex + randomNumber.toString();
};

const handleDisplayPrevChat = () => {
  if(!getStore()) return
  const data: MessageStoreType[] = JSON.parse(getStore() as string)

  data.forEach(msg => {
    msg.message = msg.message.replace("\n\n", "")
    messageBox?.appendChild(generateChat(msg.message, msg.type === "bot", msg.id))
  })

  handleScrollDown()
}

const handleDeleteChat = (event: Event) => {
  const id = event.target?.id  
  if(!id || !getStore()) return
  const prevStore: MessageStoreType[] = JSON.parse(getStore() as string)
  console.log(prevStore)
  console.log(id)
  if (!prevStore.find(chat => chat.id === id)) return
  const newStore = prevStore.filter(store => store.id !== id)
  localStorage.setItem(STORE_NAME, JSON.stringify(newStore))
  Toastify({text: "Chat deleted!", style: { fontSize: ".9rem", background: "#06beb699" }}).showToast()
  handleDisplayPrevChat()
}

const handleAddToStack = (message: string) => {
  if(commandStack.length >= 10) commandStack.pop()
  commandStack.unshift(message)
}

const generateChat = (message: any, isAI: boolean, id: string) => {
  const messageNode = document.createElement("div");
  messageNode.innerHTML = `
  <div class="wrapper ${isAI && "ai"}" ondblclick="handleDeleteChat(event)">
  <div class="floating-btns">
    <button type="button" data-id="${id}" onclick="handleCopy(event)" class="floating-btn">
      <ion-icon name="copy-outline"></ion-icon>
    </button>

    <button type="button" data-id="${id}" onclick="handleToggleFormatting(event)" class="floating-btn">
      <ion-icon id="flash-${id}" name="flash-outline"></ion-icon>
    </button>
  </div>
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

const handleCopy = (e: MouseEvent) => {
  let id = e?.target?.parentNode?.dataset?.id 
  if(!id) id = e?.target?.dataset?.id

  const message = document.getElementById(id)?.innerText!
  navigator.clipboard.writeText(message)
  .then(() => {
    Toastify({text: "Text copied!", style: { fontSize: ".9rem", background: "#06beb699" }}).showToast()
  })

}

const handleToggleFormatting = (e: Event) => {

  let id = e?.target?.parentNode?.dataset?.id 
  if(!id) id = e?.target?.dataset?.id

  const messageElement = document.getElementById(id)!
  const message = messageElement.innerHTML
  const flashIcon = document.getElementById(`flash-${id}`)

  if(!flashIcon?.getAttribute("data-on")) {
    // Keep track of the formal message
    flashIcon?.setAttribute("prevMsg", message)

    // Format the message
    messageElement.innerHTML = parseLinks(message)

    // Keep track of icon change
    flashIcon?.setAttribute("name", "flash-off-outline")
    flashIcon?.setAttribute("data-on", "true")
    return
  }

  // Add the prev message back
  const prevMsg =  flashIcon?.getAttribute("prevMsg")!
  messageElement.innerHTML = prevMsg
  // Change the icon back
  flashIcon?.setAttribute("name", "flash-outline")

  // Remove the prev message and the color of the icon
  flashIcon?.removeAttribute("data-on")
  flashIcon?.getAttribute("prevMsg")
  
}

const parseLinks = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a class="link" target="_blank" referrerpolicy="no-referer" href="$1">$1</a>');
}


// const parseCodeFields = (str: string): string => {
//   const codeRegex = /`(.+?)`/g; 
//   return str.replace(codeRegex, '<pre><code>$1</code></pre>');
// }

const handlePingNetwork = async () => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "Hello" }),
  };
  try {
    await fetch(CHAT_BOT_URL, options);
  }
  catch(e: any) {
    console.log(e)
  }
}

const handleThinking = (element: HTMLElement) => {
  element.innerHTML = "";
  const interval = setInterval( async () => {
    if (element.innerHTML.length >= 3) {
      element.innerHTML = "";
      await sleep()
    }

    element.innerHTML += ".";
  }, 300);

  return interval;
};

const handleTypeChat = (element: HTMLElement, text: string) => {
  element.innerHTML = "";
  element.classList.add("typing")

  let currentIndex = 0;
  const interval: NodeJS.Timer = setInterval(() => {
    if (currentIndex > text.length) {
      if(element.classList.contains("typing")) element.classList.remove("typing");
      let mainText = text
      // mainText = parseLinks(mainText)
      element.innerHTML = mainText;
      return clearInterval(interval);
    }
    element.innerHTML += text.charAt(currentIndex);
    currentIndex++;
    handleScrollDown();
  }, 20);
};

const handleScrollDown = () =>
  messageBox?.scrollTo({
    top: messageBox.scrollHeight,
    left: 0,
    behavior: "auto",
  });

const getStore = (): string | null => localStorage.getItem(STORE_NAME);

const handleFormSubmit = async () => {

  // Add to storage 
  const prevData: MessageStoreType[] = getStore() ? JSON.parse(getStore() as string) : []
 
  const formData = new FormData(form as HTMLFormElement);
  if(!formData.get("message")) return
  // Add the users chat
  const userMsgId = generateID()
  messageBox?.append(
    generateChat(formData.get("message"), false, userMsgId)
  );
  // Add user's message to store
  prevData.push({ id: userMsgId, type: "user", message: formData.get("message") as string})

  // Add a thinking bar
  const id = generateID();
  messageBox?.append(generateChat("...", true, id));
  const chatDiv = document.getElementById(id) as HTMLElement;

  const interval = handleThinking(chatDiv);
  handleScrollDown()

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
      prevData.push({ id, type: "bot", message: "Sorry something went wrong. Please try again"})
      localStorage.setItem(STORE_NAME, JSON.stringify(prevData));
      console.log(error);
      handleScrollDown();
      return;
    }
    // Add bot's message to store
    prevData.push({ id, type: "bot", message: text as string })

    // Overide the store
    localStorage.setItem(STORE_NAME, JSON.stringify(prevData));

    // Add command to stack
    handleAddToStack(formData.get("message") as string)

    // Remove the thinking bar
    clearInterval(interval);

    // Type in the chats
    handleTypeChat(chatDiv, text.trim() as string);

    // Scroll down
    handleScrollDown();

    // Reset Form
    form.reset();
  } catch (error) {
    clearInterval(interval);
    chatDiv.innerHTML = "Sorry something went wrong. Please try again";
    console.log(error);
    handleScrollDown();
    return;
  }
};

form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  handleFormSubmit();
});

const handleGetStackItem = () => {
  if(!commandStack.length) return
  console.table({
    index: currentStackIndex,
    command: commandStack[currentStackIndex],
    stack: commandStack
  })
  messageInput.value = commandStack[currentStackIndex]
}

const handleMoveDownStack = () => {
  if(!commandStack.length || currentStackIndex <= 0) return
  currentStackIndex--
  handleGetStackItem()
}

const handleMoveUpStack = () => {
  if(!commandStack.length || currentStackIndex > commandStack.length - 2 ) return
  currentStackIndex++
  handleGetStackItem()
}

window.addEventListener("load", handleDisplayPrevChat)

messageInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if(event.shiftKey && event.key.toLowerCase() === "enter"){
    messageInput.value += "\ "
  }

  if(event.altKey && event.key.toLowerCase() === "arrowup") handleMoveUpStack()
  if(event.altKey && event.key.toLowerCase() === "arrowdown") handleMoveDownStack()

  if (event.key.toLowerCase() == "enter" && !event.shiftKey) {
    event.preventDefault();
    handleFormSubmit();
  }
});

window.handleCopy = handleCopy;
window.handleDeleteChat = handleDeleteChat;
window.handleToggleFormatting = handleToggleFormatting
window.addEventListener("load", handlePingNetwork, { once: true });