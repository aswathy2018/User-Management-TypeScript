import { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel";
import *as bcrypt from "bcrypt";

const loadLogin = async (req: Request, res: Response) => {
  try {
    // Prevent caching of the login page
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.session && req.session.user) {
      const admin = await userModel.findById(req.session.user);
      if (admin && admin.isAdmin) {
        return res.redirect('/admin');
      }
    }

    return res.render("adLogin.ejs", { message: null });
  } catch (error) {
    console.log("Error in loadLogin controller", error);
  }
};


const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const userData = await userModel.findOne({ email });

    if (!userData) {
      return res.render("adLogin.ejs", { message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res.render("adLogin.ejs", { message: "Invalid password" });
    }

    if (!userData.isAdmin) {
      return res.render("adLogin.ejs", { message: "Access denied — not an admin" });
    }

    req.session.user = userData._id;
    return res.redirect("/admin");
  } catch (error) {
    console.error("Error in admin login:", error);
    res.render("adLogin.ejs", { message: "Server error" });
  }
};


const loadDashboard =async (req:Request,res:Response):Promise<void>=>{
    try {
        let admin=req.session.user
        if(!admin){
            res.redirect('/admin/login')
            return
        }
        let adminData = await userModel.find({isAdmin:true})

        let users =await userModel.find({isAdmin:false})

        console.log("admin",adminData,"user",users);
        res.render('dashboard',{admin:adminData[0],users})
    } catch (error) {
        console.log(error,"loadDashboard error");
        res.status(500).send("something wrong while loading the dashboard")
    }
}

let blockUser =async(req:Request,res:Response):Promise<void>=>{
    try{

    let userId = req.params.id
    console.log("user id to block/unblock ",userId);
    let user= await userModel.findById(userId)

    if(!user){
        res.redirect('/admin')
        return
    }

    user.isBlocked=!user.isBlocked
    await user.save()

    console.log(`user with ${userId} is now ${user.isBlocked ? 'blocked' : 'unblocked'}`);
    

    res.redirect('/admin')
 } catch(error){
        console.log("error in block user",error);
        
        res.redirect('/admin')
    }
}

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log("Failed to destroy the session ", err);
        return res.status(500).send("Error occurred while logging out");
      }

      // Prevent caching of post-logout pages
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      res.redirect('/admin/login');
    });
  } catch (error) {
    console.error("Error in logout controller: ", error);
    res.status(500).send("An unexpected error occurred.");
  }
};



export default {
    loadLogin,
    login,
    loadDashboard,
    blockUser,
    logout
}