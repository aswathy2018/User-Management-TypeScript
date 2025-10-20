import { Router } from "express";
import adminController from "../controller/adminController";
import auth from "../middleware/auth";


let router = Router();

router.get('/login', adminController.loadLogin);
router.post('/login',adminController.login);
router.get('/', auth.adminAuth, adminController.loadDashboard);
router.post('/block-user/:id', auth.adminAuth, adminController.blockUser)
router.post('/logout', adminController.logout)




export default router;