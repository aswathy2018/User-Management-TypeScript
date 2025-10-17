require('dotenv').config()
import mongoose from "mongoose";
import express, {Application, Request, Response, NextFunction} from "express";
import path from "path";
import session from "express-session";
import user from "./routes/userRoute";

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error When Connecting MongoDB", err));


const app: Application = express()

app.use(session({
    secret: 'UseRValuedSIte321',
    resave: false,
    saveUninitialized: false
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs")
app.set("views", [
    path.join(__dirname, "../views/user"),
    path.join(__dirname, "../views/admin")
])


app.use("/", user)



app.listen(5280, ()=>{
    console.log(`http://localhost:${5280}`)
})