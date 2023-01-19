import { Router, Request, Response } from 'express';
import userModel from '../models/user.model';
import response from '../utils/response';


const usersRoute = Router()

usersRoute.get("/", async (req: Request, res: Response) => {
  const users = await userModel.find({})
  res.status(200).send(response("users", users, true))
})

export default usersRoute