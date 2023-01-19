import { Request, Response } from 'express';
import candidateModel from '../models/candidate.model';
import userModel from '../models/user.model';
import { CustomError } from '../utils/errors';
import response from '../utils/response';


export const registerCandidate = async (req: Request | any, res: Response) => {
  if(!req.body.election) throw new CustomError("Election Id is required")
  const candidate = await candidateModel.create({ election: req.body.election, user: req.user._id})
  // Update users table
  const user = await userModel.findByIdAndUpdate(req.user._id, {$set: { isCandidate: true }}, { password: 0, __v: 0})
  res.status(201).send(response("Registered as candidate", { candidate, user }, true))
}
