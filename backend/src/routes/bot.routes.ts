import { Request, Response, Router } from "express";
import { Configuration, OpenAIApi } from 'openai';
import * as dotenv from 'dotenv';
dotenv.config()


const router = Router()

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

router.get("/ping", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello CHAT BOT" })
})

router.post("/", async (req: Request, res: Response) => {
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

    console.log('STATUS =>>>', response.status)
    res.status(200).json({ data: response.data.choices[0].text, error: null })
  } catch (err: any) {
    res.status(500).json({ error: err.message, data: null });
  }
})

router.post("/custom", async (req: Request, res: Response) => {
  try {
    const message = req.body.message
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      temperature: req.query.temperature ? +req.query.temperature  : 0.7,
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

router.post("/image", async(req: Request, res: Response) => {
  try {
    const prompt = req.body.message
    const response = await openai.createImage({
     prompt,
     n: 1,
     response_format: "url",
     size: "1024x1024",
    });
    res.status(200).json({ data: response.data.data, error: null })
  } catch (err: any) {
    res.status(500).json({ error: err.message, data: null });
  }

})

export default router