import userModel from "../models/userModel";
import { Request, Response, NextFunction } from "express";

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Set cache-control headers to prevent caching
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        if (req.session && req.session.user) {
            const user = await userModel.findOne({ _id: req.session.user, isAdmin: false });
            if (user) {
                // Redirect authenticated users to /home for GET requests to login/signup pages
                if (req.method === 'GET' && (req.path === '/' || req.path === '/signup')) {
                    return res.redirect('/home');
                }
                // Allow other routes (e.g., /home) or POST requests to proceed
                return next();
            } else {
                // Invalid user, clear session and send unauthorized response
                req.session.destroy((err) => {
                    if (err) console.error("Session destroy error:", err);
                    return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
                });
            }
        } else {
            // No session - allow GET requests to login/signup pages, block others
            if (req.method === 'GET' && (req.path === '/' || req.path === '/signup')) {
                return next(); // Allow access to login/signup pages
            }
            res.status(401).json({ success: false, message: 'Unauthorized: No session user' });
            return;
        }
    } catch (error) {
        console.error("Error in userAuth middleware", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};

export default { userAuth };