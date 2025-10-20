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
const loadLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.render("adLogin.ejs", { message: null });
    }
    catch (error) {
        console.log("Error in loadLogin controller", error);
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userData = yield userModel_1.default.findOne({ email });
        if (!userData) {
            return res.render("adLogin.ejs", { message: "User not found" });
        }
        const passwordMatch = yield bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return res.render("adLogin.ejs", { message: "Invalid password" });
        }
        if (!userData.isAdmin) {
            return res.render("adLogin.ejs", { message: "Access denied — not an admin" });
        }
        req.session.user = userData._id;
        return res.redirect("/admin");
    }
    catch (error) {
        console.error("Error in admin login:", error);
        res.render("adLogin.ejs", { message: "Server error" });
    }
});
const loadDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.session.user;
        if (!admin) {
            res.redirect('/admin/login');
            return;
        }
        let adminData = yield userModel_1.default.find({ isAdmin: true });
        let users = yield userModel_1.default.find({ isAdmin: false });
        console.log("admin", adminData, "user", users);
        res.render('dashboard', { admin: adminData[0], users });
    }
    catch (error) {
        console.log(error, "loadDashboard error");
        res.status(500).send("something wrong while loading the dashboard");
    }
});
let blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.params.id;
        console.log("user id to block/unblock ", userId);
        let user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.redirect('/admin');
            return;
        }
        user.isBlocked = !user.isBlocked;
        yield user.save();
        console.log(`user with ${userId} is now ${user.isBlocked ? 'blocked' : 'unblocked'}`);
        res.redirect('/admin');
    }
    catch (error) {
        console.log("error in block user", error);
        res.redirect('/admin');
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
            res.redirect('/login');
        });
    }
    catch (error) {
        console.error("Error in logout controller: ", error);
        res.status(500).send("An unexpected error occurred.");
    }
});
exports.default = {
    loadLogin,
    login,
    loadDashboard,
    blockUser,
    logout
};
