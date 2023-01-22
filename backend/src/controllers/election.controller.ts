import { CustomError } from './../utils/errors';
import { Request, Response } from 'express';
import electionModel from '../models/election.model';
import userModel from '../models/user.model';
import response from '../utils/response';


export const registerElection = async (req: Request | any, res: Response) => {
  if(!req.body.title) throw new CustomError("Please provide a title", 400)
  if(!req.body.startDate) throw new CustomError("Please provide a starting date", 400)
  if(!req.body.endDate) throw new CustomError(" provide an end date", 400)
  if(!req.body.description) throw new CustomError("Please provide a description", 400)

  const election = await electionModel.create({ ...req.body, user: req.user._id})
  const user = await userModel.findByIdAndUpdate(req.user._id, { $set: { isElecting: true } }, { password: 0, __v: 0 })
  
  res.status(201).send(response("Election created!", { election, user }, true))
}

export const getAllElections = async (req: Request, res: Response) => {
  const elections = await electionModel.find({})
  res.status(200).send(response("All elections", elections, true))
}