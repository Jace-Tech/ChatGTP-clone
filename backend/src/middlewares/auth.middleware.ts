import { CustomError } from './../utils/errors';
import { Request, Response, NextFunction} from 'express';
import { verify } from 'jsonwebtoken';
import { config } from "dotenv"
config()

export default async function (req: Request | any, res: Response, next: NextFunction) {
  if(!req.headers.authorization) throw new CustomError("Authorization header is required", 400);
  
  const token = req.headers.authorization.split(" ")[1]
  if(!token) throw new CustomError("Missing token", 400)

  const userId = verify(token, process.env.SECRET as string)
  if(!userId) throw new CustomError("Authentication failed: Invalid token", 401)

  console.log(userId)
  // next()
}