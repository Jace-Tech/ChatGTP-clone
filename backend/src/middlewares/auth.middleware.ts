import { CustomError } from './../utils/errors';
import { Request, Response, NextFunction} from 'express';
import jwt, { verify } from 'jsonwebtoken';
import { config } from "dotenv"
import userModel from '../models/user.model';
config()

export default async function (req: Request | any, res: Response, next: NextFunction) {
  if(!req.headers.authorization) throw new CustomError("Authorization header is required", 400);
  
  const token = req.headers.authorization.split(" ")[1]
  if(!token) throw new CustomError("Missing token", 400)

  const { userId }: any = verify(token, process.env.SECRET as string)
  if(!userId) throw new CustomError("Authentication failed: Invalid token", 401)

  // Get the user 
  const user = await userModel.findOne({ _id: userId }, { password: 0, __v: 0 })
  if(!user) throw new CustomError("Authentication failed: Invalid user", 401)
  req.user = user
  next()
}