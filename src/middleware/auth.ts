import userModel from "../models/userModel";
import { Request, Response, NextFunction } from "express";

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (req.session.user) {
            const user = await userModel.findOne({ _id: req.session.user, isAdmin: false });
            if (user) {
                next(); // Proceed to the route handler if user is found
            } else {
                res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Unauthorized: No session user' });
        }
    } catch (error) {
        console.error("Error in userAuth middleware", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export default { userAuth };