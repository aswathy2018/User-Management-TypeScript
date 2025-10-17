import { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel";


const getSignup = async (req: Request, res: Response) => {
    try {
        if (req.session.user) {
            res.send('hello ')
            return res.redirect('/')
        } else {
            return res.render('index.ejs')
        }
    } catch (error) {
        console.log("Error in getSignup controller", error)
    }
}

export default {
    getSignup,
}