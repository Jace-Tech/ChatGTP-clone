import { Router } from 'express';
import botRoutes from "./bot.routes"
import authRoutes from "./auth.routes"
import candidateRoutes from "./candidate.routes"
import electionRoutes from './election.routes';
import usersRoutes from './users.routes';

const Routes = Router()

Routes.use("/", botRoutes)
Routes.use("/auth", authRoutes)
Routes.use("/candidate", candidateRoutes)
Routes.use("/election", electionRoutes)
Routes.use("/user", usersRoutes)

export default Routes