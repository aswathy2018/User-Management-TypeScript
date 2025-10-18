import { Router } from "express";
import userController from "../controller/userController"
import auth from "../middleware/auth"


let router = Router()

router.get('/', userController.getIndex)
router.get('/signup',userController.getSignupPage)
router.post('/signup', userController.signup)
router.get('/home', auth.userAuth,userController.getHome)



export default router