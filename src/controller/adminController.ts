import { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel";
import *as bcrypt from "bcrypt";

const loadLogin = async (req: Request, res: Response) => {
    try {
        return res.render("adLogin.ejs", {message: null})
    } catch (error) {
        console.log("Error in loadLogin controller", error)
    }
}


export default {
    loadLogin,
}