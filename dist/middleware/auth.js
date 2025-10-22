"use strict";
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
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        if (req.session && req.session.user) {
            const user = yield userModel_1.default.findOne({ _id: req.session.user, isAdmin: false });
            if (user) {
                if (req.method === 'GET' && (req.path === '/' || req.path === '/signup')) {
                    return res.redirect('/home');
                }
                return next();
            }
            else {
                req.session.destroy((err) => {
                    if (err)
                        console.error("Session destroy error:", err);
                    return res.redirect('/');
                });
            }
        }
        else {
            if (req.method === 'GET' && (req.path === '/' || req.path === '/signup')) {
                return next();
            }
            res.redirect('/');
            return;
        }
    }
    catch (error) {
        console.error("Error in userAuth middleware", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
});
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        if (!req.session.user) {
            return res.redirect('/admin/login');
        }
        const user = yield userModel_1.default.findById(req.session.user);
        if (user && user.isAdmin) {
            return next();
        }
        else {
            req.session.destroy((err) => {
                if (err)
                    console.error("Session destroy error:", err);
            });
            return res.redirect('/admin/login');
        }
    }
    catch (error) {
        console.error("Error in adminAuth middleware:", error);
        res.status(500).send("Internal server error");
    }
});
exports.default = { userAuth, adminAuth };
