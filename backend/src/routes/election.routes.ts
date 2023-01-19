import { registerElection } from './../controllers/election.controller';
import { Router } from 'express';


const electionRoutes = Router()

electionRoutes.post("/", registerElection)

export default electionRoutes