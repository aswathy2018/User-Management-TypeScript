import { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel";
import * as bcrypt from "bcrypt";
import {promises} from "dns";
import { request } from "http";


const getIndex = async (req: Request, res: Response): Promise<void> => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        if (req.session.user) {
            res.redirect('/home');
        } else {
            res.render('index.ejs');
        }
    } catch (error) {
        console.log("Error in getIndex controller", error);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    }
};

const loginPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            res.status(404).json({ success: false, message: 'Email not found' });
            return;
        }

        if (user.isBlocked === true) {
            res.status(403).json({ success: false, message: 'This user is currently blocked' });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            res.status(401).json({ success: false, message: 'Incorrect password' });
            return;
        }

        req.session.user = user._id;
        res.status(200).json({ success: true, redirect: '/home' });
    } catch (error) {
        console.error("Error in login page controller ", error);
        next(error);
    }
};

const getSignupPage = async (req: Request, res: Response): Promise<void> => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        if (req.session.user) {
            res.redirect('/home');
        } else {
            res.render('signup.ejs');
        }
    } catch (error) {
        console.log("Error in getSignupPage controller", error);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    }
};

const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

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
            res.status(200).json({ success: true, message: 'Registration successful', redirect: '/home' });
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

const getHome = async (req: Request, res: Response): Promise<void> => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        if (req.session.user) {
            let userData = await userModel.findById(req.session.user);
            console.log(userData, "userData: ");

            if (userData) {
                res.render('home.ejs', { user: userData, query: req.query });
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.log("Error in home page controller", error);
        res.redirect('/');
    }
};

const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log("Failed to destroy the session ", err);
                res.status(500).send("Error occurred while logging out");
                return;
            }
            // this is setting for cache control headers
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.redirect('/');
        });
    } catch (error) {
        console.error("Error in logout controller: ", error);
        res.status(500).send("An unexpected error occurred.");
    }
};

const checkAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        if (req.session.user) {
            const user = await userModel.findOne({ _id: req.session.user, isAdmin: false });
            if (user) {
                res.status(200).json({ isAuthenticated: true });
            } else {
                res.status(200).json({ isAuthenticated: false });
            }
        } else {
            res.status(200).json({ isAuthenticated: false });
        }
    } catch (error) {
        console.error("Error in checkAuth controller", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const getEdit = async (req: Request, res: Response): Promise<void> =>{
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        if (req.session.user) {
            let userData = await userModel.findById(req.session.user);

            if (userData) {
                res.render('changePassword.ejs', { user: userData , error: null});
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error("Error in getEdit controller: ", error);
        res.status(500).send("An unexpected error occurred in getEdit.");
    }
}

const updatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            const userData = await userModel.findById(req.session.user);
            return res.render('changePassword.ejs', { user: userData, error: 'All fields are mandatory.' });
        }

        if (newPassword !== confirmPassword) {
            const userData = await userModel.findById(req.session.user);
            return res.render('changePassword.ejs', { user: userData, error: 'New password and confirm password do not match.' });
        }

        if (newPassword.includes(' ')) {
            const userData = await userModel.findById(req.session.user);
            return res.render('changePassword.ejs', { user: userData, error: 'New password cannot contain spaces.' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Z][A-Za-z\d@$!%*?&]{4,}$/;
        if (!passwordRegex.test(newPassword)) {
            const userData = await userModel.findById(req.session.user);
            return res.render('changePassword.ejs', { user: userData, error: 'New password must start with a capital letter, contain at least one lowercase letter, one number, one special character (@$!%*?&), and be at least 5 characters long.' });
        }

        const user = await userModel.findById(req.session.user);
        if (!user) {
            return res.redirect('/');
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            const userData = await userModel.findById(req.session.user);
            return res.render('changePassword.ejs', { user: userData, error: 'Incorrect current password.' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.redirect('/home?success=passwordUpdated');

    } catch (error) {
        console.error("Error in updatePassword controller: ", error);
        const userData = await userModel.findById(req.session.user);
        return res.render('changePassword.ejs', { user: userData, error: 'Password not updated. Please try again.' });
    }
};



export default {
    getIndex,
    loginPage,
    getSignupPage,
    signup,
    getHome,
    logout,
    checkAuth,
    getEdit,
    updatePassword,
}