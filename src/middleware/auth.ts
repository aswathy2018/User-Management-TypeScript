import userModel from "../models/userModel";
import { Request, Response, NextFunction } from "express";

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        if (req.session && req.session.user) {
            const user = await userModel.findOne({ _id: req.session.user, isAdmin: false });
            if (user) {
                if (req.method === 'GET' && (req.path === '/' || req.path === '/signup')) {
                    return res.redirect('/home');
                }
                return next();
            } else {
                req.session.destroy((err) => {
                    if (err) console.error("Session destroy error:", err);
                    return res.redirect('/');
                });

            }
        } else {
            if (req.method === 'GET' && (req.path === '/' || req.path === '/signup')) {
                return next();
            }
            res.redirect('/');
            return;
        }
    } catch (error) {
        console.error("Error in userAuth middleware", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};


const adminAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (!req.session.user) {
      return res.redirect('/admin/login');
    }

    const user = await userModel.findById(req.session.user);

    if (user && user.isAdmin) {
      return next();
    } else {
      req.session.destroy((err) => {
        if (err) console.error("Session destroy error:", err);
      });
      return res.redirect('/admin/login');
    }
  } catch (error) {
    console.error("Error in adminAuth middleware:", error);
    res.status(500).send("Internal server error");
  }
};


export default { userAuth,adminAuth };