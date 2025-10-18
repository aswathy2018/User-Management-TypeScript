import { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel";
import * as bcrypt from "bcrypt";
import {promises} from "dns";
import { request } from "http";


const getIndex = async (req: Request, res: Response): Promise<void> => {
    try {
        if (req.session.user) {
            res.redirect('/');
        } else {
            res.render('index.ejs');
        }
    } catch (error) {
        console.log("Error in getSignup controller", error);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    }
};

const getSignupPage = async (req: Request, res: Response) => {
    try {
        if (req.session.user) {
            return res.redirect('/');
        } else {
            return res.render('signup');
        }
    } catch (error) {
        console.log("Error in getSignupPage controller", error);
        res.status(500).send('Internal Server Error');
    }
};

const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'All fields are required to signup' });
            return;
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            res.status(409).json({ success: false, message: 'User with this email is already registered' });
            return;
        }

        const securePass = await securePassword(password);
        const user = new userModel({
            name,
            email,
            password: securePass,
            isAdmin: false,
            isBlocked: false
        });

        const userData = await user.save();

        if (userData) {
            req.session.user = userData.id;
            res.status(200).json({ success: true, message: 'Registration successful' });
        } else {
            res.status(500).json({ success: false, message: 'Sign-up failed' });
        }
    } catch (error) {
        console.error("Error in signup controller", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const securePassword = async (password: string): Promise<string> => {
    try {
        const passHash = await bcrypt.hash(password, 10);
        return passHash;
    } catch (error) {
        console.log("Error in securePassword Controller ", error);
        throw error;
    }
};

const getHome = async (req: Request, res: Response) => {
    try {
        if(req.session.user){
            let userData = await userModel.findById(req.session.user)
            console.log(userData, "userData: ");

            if(userData){
                res.render('home', {user: userData})
            }else{
                res.redirect('/')
            }
        }else{
            res.redirect('/')
        }
    } catch (error) {
        console.log("Error in home page controller", error);
        res.redirect('/')
    }
}

export default {
    getIndex,
    getSignupPage,
    signup,
    getHome,
}