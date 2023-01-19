import { registerCandidate } from './../controllers/candidate.controller';
import { Router } from 'express';


const candidateRoutes = Router()

candidateRoutes.post("/", registerCandidate)

export default candidateRoutes