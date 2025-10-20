"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controller/userController"));
const auth_1 = __importDefault(require("../middleware/auth"));
let router = (0, express_1.Router)();
router.get('/', auth_1.default.userAuth, userController_1.default.getIndex);
router.get('/signup', auth_1.default.userAuth, userController_1.default.getSignupPage);
router.post('/login', userController_1.default.loginPage);
router.post('/signup', userController_1.default.signup);
router.get('/home', auth_1.default.userAuth, userController_1.default.getHome);
router.post('/logout', userController_1.default.logout);
router.get('/check-auth', userController_1.default.checkAuth);
exports.default = router;
