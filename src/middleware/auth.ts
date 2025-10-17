import userModel from "../models/userModel";
import { Request, Response, NextFunction } from "express";

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if(req.session.user){
            const user = await userModel.findOne({id: req.session.user, isAdmin: false});
        }
    } catch (error) {
        
    }
}

export default {userAuth};