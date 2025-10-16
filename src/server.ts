import mongoose from "mongoose";
import express, {Application, Request, Response, NextFunction} from "express";
import path from "path";
import session from "express-session";

require('dotenv').config()

const app: Application = express()

// app.use((req: Request, res: Response, next: NextFunction) =>{

// })

app.get('/',(req: Request, res: Response) => {
    res.send("Hiiiiiii")
})

app.listen(5280, ()=>{
    console.log(`http://localhost:${5280}`)
})