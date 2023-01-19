import { Application, NextFunction, Request, Response } from "express";
import response from "../utils/response";
import "express-async-errors"
export default function (app: Application) {
  const errorNames = [
    "CastError",
    "JsonWebTokenError",
    "ValidationError",
    "SyntaxError",
    "MongooseError",
    "MongoError",
  ];

  app.use("*", (req: Request, res: Response) => {
    res.send(response("Invalid request", null, false));
  });

  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    if (error.name == "CustomError") {
      res.status(error.statusCode).send(response(error.message, null, false));
    } else if (error.name == "MongoError" && error.code == 11000) {
      // Catch duplicate key field error
      const field = Object.entries(error.keyValue)[0][0];
      res.status(400).send(response(`${field} already exists`, null, false));
    } else if (errorNames.includes(error.name)) {
      res.status(400).send(response(error.message, null, false));
    } else {
      res.status(500).send(response(error.message, null, false));
    }
  });

  return app
}
