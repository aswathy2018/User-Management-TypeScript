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
        if (req.session.user) {
            res.redirect('/');
        }
        else {
            res.render('index.ejs');
        }
    }
    catch (error) {
        console.log("Error in getSignup controller", error);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    }
});
const getSignupPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.session.user) {
            return res.redirect('/');
        }
        else {
            return res.render('signup');
        }
    }
    catch (error) {
        console.log("Error in getSignupPage controller", error);
        res.status(500).send('Internal Server Error');
    }
});
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
            res.status(200).json({ success: true, message: 'Registration successful' });
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
        if (req.session.user) {
            let userData = yield userModel_1.default.findById(req.session.user);
            console.log(userData, "userData: ");
            if (userData) {
                res.render('home', { user: userData });
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
exports.default = {
    getIndex,
    getSignupPage,
    signup,
    getHome,
};
