import { Router } from "express";
import userController from "../controller/userController"
import auth from "../middleware/auth"


let router = Router()

router.get('/', userController.getSignup)


export default router