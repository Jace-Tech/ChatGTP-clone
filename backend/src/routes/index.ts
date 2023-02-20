import { Router } from 'express';
import botRoutes from "./bot.routes"
const Routes = Router()

Routes.use("/", botRoutes)
export default Routes