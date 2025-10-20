"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = __importDefault(require("../controller/adminController"));
let router = (0, express_1.Router)();
router.get('/login', adminController_1.default.loadLogin);
exports.default = router;
