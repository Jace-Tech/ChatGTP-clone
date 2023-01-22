import { Request, Response } from 'express';
import candidateModel from '../models/candidate.model';
import userModel from "../models/user.model"
import { CustomError } from '../utils/errors';
import response from "../utils/response"


export const handleGetUsers = async (req: Request, res: Response) => {
  const users = await userModel.find({})
  res.status(200).send(response("users", users, true))
}

export const handleDeleteUser = async (req: Request, res: Response) => {
  if(!req.params.id) throw new CustomError("id is required")
  const user = await userModel.findOneAndDelete({ _id: req.params.id }, { password: 0, __v: 0 })
  res.status(200).send(response("User deleted", user, true))
}

export const handleGetUsersCandidacy = async (req: Request | any, res: Response) => {
  const userCandidacy = await candidateModel.find({ user: req.user._id })
  res.status(200).send(response("Users candidacy", userCandidacy, true))
}