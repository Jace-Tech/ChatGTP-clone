import mongoose, { ConnectOptions } from "mongoose";
import { config } from "dotenv"
config()

export default async function (cb: () => void ) {
  mongoose.set('strictQuery', true)
  await mongoose.connect(process.env.MONGO_URI as string, () => {
    console.log("Connected to DB...")
    cb()
  })
}