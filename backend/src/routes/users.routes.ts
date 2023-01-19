import { handleDeleteUser, handleGetUsers } from './../controllers/user.controller';
import { Router, Request, Response } from 'express';
import authMiddleware from '../middlewares/auth.middleware';


const usersRoute = Router()

usersRoute.get("/", authMiddleware, handleGetUsers)
usersRoute.get("/delete/:id", handleDeleteUser)

export default usersRoute