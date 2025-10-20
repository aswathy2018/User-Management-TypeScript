"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt = __importStar(require("bcrypt"));
const getIndex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        if (req.session.user) {
            res.redirect('/home');
        }
        else {
            res.render('index.ejs');
        }
    }
    catch (error) {
        console.log("Error in getIndex controller", error);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    }
});
const loginPage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: 'Email not found' });
            return;
        }
        if (user.isBlocked === true) {
            res.status(403).json({ success: false, message: 'This user is currently blocked' });
            return;
        }
        const isPasswordMatch = yield bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401).json({ success: false, message: 'Incorrect password' });
            return;
        }
        req.session.user = user._id;
        res.status(200).json({ success: true, redirect: '/home' });
    }
    catch (error) {
        console.error("Error in login page controller ", error);
        next(error);
    }
});
const getSignupPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        if (req.session.user) {
            res.redirect('/home');
        }
        else {
            res.render('signup.ejs');
        }
    }
    catch (error) {
        console.log("Error in getSignupPage controller", error);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    }
});
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'All fields are required to signup' });
            return;
        }
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(409).json({ success: false, message: 'User with this email is already registered' });
            return;
        }
        const securePass = yield securePassword(password);
        const user = new userModel_1.default({
            name,
            email,
            password: securePass,
            isAdmin: false,
            isBlocked: false
        });
        const userData = yield user.save();
        if (userData) {
            req.session.user = userData.id;
            res.status(200).json({ success: true, message: 'Registration successful', redirect: '/home' });
        }
        else {
            res.status(500).json({ success: false, message: 'Sign-up failed' });
        }
    }
    catch (error) {
        console.error("Error in signup controller", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
const securePassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const passHash = yield bcrypt.hash(password, 10);
        return passHash;
    }
    catch (error) {
        console.log("Error in securePassword Controller ", error);
        throw error;
    }
});
const getHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        if (req.session.user) {
            let userData = yield userModel_1.default.findById(req.session.user);
            console.log(userData, "userData: ");
            if (userData) {
                res.render('home.ejs', { user: userData });
            }
            else {
                res.redirect('/');
            }
        }
        else {
            res.redirect('/');
        }
    }
    catch (error) {
        console.log("Error in home page controller", error);
        res.redirect('/');
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        console.error("Error in logout controller: ", error);
        res.status(500).send("An unexpected error occurred.");
    }
});
const checkAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.session.user) {
            const user = yield userModel_1.default.findOne({ _id: req.session.user, isAdmin: false });
            if (user) {
                res.status(200).json({ isAuthenticated: true });
            }
            else {
                res.status(200).json({ isAuthenticated: false });
            }
        }
        else {
            res.status(200).json({ isAuthenticated: false });
        }
    }
    catch (error) {
        console.error("Error in checkAuth controller", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.default = {
    getIndex,
    loginPage,
    getSignupPage,
    signup,
    getHome,
    logout,
    checkAuth
};
