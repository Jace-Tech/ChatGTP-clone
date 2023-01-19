import nodemailer from "nodemailer"
import {config} from "dotenv"
import Mail from "nodemailer/lib/mailer"

config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  }
})

export async function sendMail(options: Mail.Options) {
  return await transporter.sendMail(options)
}