import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

const PORT = process.env.PORT || 5000

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello CHAT BOT" })
})

app.post("/", async (req, res) => {
  try {
    const message = req.body.message
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      temperature: 0.7,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    res.status(200).json({ data: response.data.choices[0].text, error: null })
  } catch (err: any) {
    res.status(500).json({ error: err.message, data: null });
  }

})


app.listen(PORT, () => console.log("Server running..."));
