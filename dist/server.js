"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const app = (0, express_1.default)();
// app.use((req: Request, res: Response, next: NextFunction) =>{
// })
app.get('/', (req, res) => {
    res.send("Hiiiiiii");
});
app.listen(5280, () => {
    console.log(`http://localhost:${5280}`);
});
