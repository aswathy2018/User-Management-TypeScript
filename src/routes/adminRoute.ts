import { Router } from "express";
import adminController from "../controller/adminController";
import auth from "../middleware/auth";


let router = Router();

router.get('/login', adminController.loadLogin);



export default router;