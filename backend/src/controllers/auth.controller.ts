import { IUser } from './../@types/common.d';
import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import userModel from '../models/user.model';
import { CustomError } from './../utils/errors';
import { sign } from "jsonwebtoken"
import { config } from "dotenv"
import response from '../utils/response';
import { generateRandomPassword } from "../utils/helpers"

config()

export const handleSignUp =  async(req: Request, res: Response) => {
  if(!req.body.name) throw new CustomError("Name is required")
  if(!req.body.email) throw new CustomError("Email is required")
  if(!req.body.password) throw new CustomError("Password is required")

  const existing = await userModel.findOne({ email: req.body.email })
  if(existing) throw new CustomError("User already exists")

  const hashedPassword = await hash(req.body.password, 12)
  const user = await userModel.create({ ...req.body, password: hashedPassword })
  
  // Send mail later
  const data = {
    id: user._id,
    email: user.email,
    name: user.name,
    isElecting: user.isElecting,
    isCandidate: user.isCandidate,
    isEmailVerified: user.isEmailVerified,
  }
  res.status(201).send(response("Registration successful", data, true))
}

export const handleSignIn =  async(req: Request, res: Response) => {
  if(!req.body.email) throw new CustomError("Email is required")
  if(!req.body.password) throw new CustomError("Password is required")

  const user = await userModel.findOne({ email: req.body.email })
  if(!user) throw new CustomError("Invalid credientials")
  if(!await compare(req.body.password, user.password)) throw new CustomError("Invalid credientials")
  const token = sign({ userId: user._id }, process.env.SECRET as string, { expiresIn: "7d" })

  // Send mail later
  const data = {
    id: user._id,
    email: user.email,
    name: user.name,
    isElecting: user.isElecting,
    isCandidate: user.isCandidate,
    isEmailVerified: user.isEmailVerified,
  }
  res.status(201).send(response("Log in successful", { ...data, token}, true))
}

export const handleSignInWithGoogle =  async(req: Request, res: Response) => {
  if(!req.body.name) throw new CustomError("Name is required")
  if(!req.body.email) throw new CustomError("Email is required")

  // Check if user exists
  const existing = await userModel.findOne({ email: req.body.email}, { password: 0, __v: 0 })
  if(existing) {
    const token = sign({ userId: existing._id }, process.env.SECRET as string, { expiresIn: "7d" })
    return res.status(200).send(response("logged in successfully", { user: existing, token }))
  }

  // If user does not exist, create
  const hashedPassword = await hash(generateRandomPassword(), 12)
  const user = await userModel.create({...req.body, password: hashedPassword})
  // Send mail later
  res.status(201).send(response("Login successful", user, true))
}