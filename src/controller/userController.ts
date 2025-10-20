import { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel";
import * as bcrypt from "bcrypt";
import {promises} from "dns";
import { request } from "http";


// const getIndex = async (req: Request, res: Response): Promise<void> => {
//     try {
//         if (req.session.user) {
//             res.redirect('/home'); // Redirect to /home instead of /
//         } else {
//             res.render('index.ejs');
//         }
//     } catch (error) {
//         console.log("Error in getIndex controller", error);
//         if (!res.headersSent) {
//             res.status(500).send('Internal Server Error');
//         }
//     }
// };

const getIndex = async (req: Request, res: Response): Promise<void> => {
    try {
        // Set cache-control headers
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

// const loginPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const { email, password } = req.body;
//         const user = await userModel.findOne({ email });

//         if (!user) {
//             res.status(404).json({ success: false, message: 'Email not found' });
//             return;
//         }

//         if (user.isBlocked === true) {
//             res.status(403).json({ success: false, message: 'This user is currently blocked' });
//             return;
//         }

//         const isPasswordMatch = await bcrypt.compare(password, user.password);

//         if (!isPasswordMatch) {
//             res.status(401).json({ success: false, message: 'Incorrect password' });
//             return;
//         }

//         req.session.user = user._id; // Use _id for MongoDB consistency
//         res.status(200).json({ success: true, redirect: '/home' });
//     } catch (error) {
//         console.error("Error in login page controller ", error);
//         next(error);
//     }
// };

// const getSignupPage = async (req: Request, res: Response): Promise<void> => {
//     try {
//         if (req.session.user) {
//             res.redirect('/home'); // Redirect to /home instead of /
//         } else {
//             res.render('signup.ejs'); // Ensure filename matches
//         }
//     } catch (error) {
//         console.log("Error in getSignupPage controller", error);
//         if (!res.headersSent) {
//             res.status(500).send('Internal Server Error');
//         }
//     }
// };

const loginPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Set cache-control headers
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
        // Set cache-control headers
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

// const signup = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { name, email, password } = req.body;

//         if (!name || !email || !password) {
//             res.status(400).json({ success: false, message: 'All fields are required to signup' });
//             return;
//         }

//         const existingUser = await userModel.findOne({ email });

//         if (existingUser) {
//             res.status(409).json({ success: false, message: 'User with this email is already registered' });
//             return;
//         }

//         const securePass = await securePassword(password);
//         const user = new userModel({
//             name,
//             email,
//             password: securePass,
//             isAdmin: false,
//             isBlocked: false
//         });

//         const userData = await user.save();

//         if (userData) {
//             req.session.user = userData.id;
//             res.status(200).json({ success: true, message: 'Registration successful' });
//         } else {
//             res.status(500).json({ success: false, message: 'Sign-up failed' });
//         }
//     } catch (error) {
//         console.error("Error in signup controller", error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// };

const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        // Set cache-control headers
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

// const getHome = async (req: Request, res: Response): Promise<void> => {
//     try {
//         if (req.session.user) {
//             let userData = await userModel.findById(req.session.user);
//             console.log(userData, "userData: ");

//             if (userData) {
//                 res.render('home.ejs', { user: userData }); // Ensure filename matches
//             } else {
//                 res.redirect('/');
//             }
//         } else {
//             res.redirect('/');
//         }
//     } catch (error) {
//         console.log("Error in home page controller", error);
//         res.redirect('/');
//     }
// };

const getHome = async (req: Request, res: Response): Promise<void> => {
    try {
        // Set cache-control headers
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        if (req.session.user) {
            let userData = await userModel.findById(req.session.user);
            console.log(userData, "userData: ");

            if (userData) {
                res.render('home.ejs', { user: userData });
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
            // Set cache-control headers for the logout response
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

export default {
    getIndex,
    loginPage,
    getSignupPage,
    signup,
    getHome,
    logout,
    checkAuth
}