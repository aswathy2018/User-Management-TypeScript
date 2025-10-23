import { Router } from "express";
import userController from "../controller/userController"
import auth from "../middleware/auth"


let router = Router()

router.get('/', auth.userAuth, userController.getIndex);
router.get('/signup', auth.userAuth, userController.getSignupPage);
router.post('/login', userController.loginPage);
router.post('/signup', userController.signup);
router.get('/home', auth.userAuth,userController.getHome);
router.post('/logout', userController.logout);
router.get('/check-auth', userController.checkAuth);
router.get('/changePassword', auth.userAuth,userController.getEdit);
router.post('/changePassword', auth.userAuth, userController.updatePassword);


export default router