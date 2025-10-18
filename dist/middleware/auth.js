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
        if (req.session.user) {
            const user = yield userModel_1.default.findOne({ _id: req.session.user, isAdmin: false });
            if (user) {
                next(); // Proceed to the route handler if user is found
            }
            else {
                res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
            }
        }
        else {
            res.status(401).json({ success: false, message: 'Unauthorized: No session user' });
        }
    }
    catch (error) {
        console.error("Error in userAuth middleware", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.default = { userAuth };
