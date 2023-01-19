import express, { Application } from 'express';
import cors from 'cors'
import morgan from 'morgan';

export default function (app: Application) {
  app.use(cors({ origin: "*" }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(morgan("tiny"))

  return app
}