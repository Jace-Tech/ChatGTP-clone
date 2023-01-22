import { registerElection, getAllElections } from './../controllers/election.controller';
import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';


const electionRoutes = Router()

electionRoutes.post("/", authMiddleware, registerElection)
electionRoutes.get("/", getAllElections)

export default electionRoutes