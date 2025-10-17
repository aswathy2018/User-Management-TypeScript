"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("Error When Connecting MongoDB", err));
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: 'UseRValuedSIte321',
    resave: false,
    saveUninitialized: false
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", [
    path_1.default.join(__dirname, "../views/user"),
    path_1.default.join(__dirname, "../views/admin")
]);
app.use("/", userRoute_1.default);
app.listen(5280, () => {
    console.log(`http://localhost:${5280}`);
});
