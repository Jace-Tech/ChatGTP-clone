import { registerCandidate } from './../controllers/candidate.controller';
import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';


const candidateRoutes = Router()

candidateRoutes.post("/", authMiddleware, registerCandidate)

export default candidateRoutes