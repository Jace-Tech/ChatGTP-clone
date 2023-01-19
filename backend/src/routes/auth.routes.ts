import { handleSignUp, handleSignIn } from './../controllers/auth.controller';
import { Router } from 'express';


const authRoutes = Router()

authRoutes.post("/sign-up", handleSignUp)
authRoutes.post("/sign-in", handleSignIn)

export default authRoutes