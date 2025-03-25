import dbConnection from "@/lib/dbConnect";
import userModel from "@/models/register";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt"

export async function POST(request: NextRequest) {
    await dbConnection();
    try {
        const {username, email, password} = await request.json();
        const existingUser =await userModel.findOne({username, email});
        if (existingUser) {
            console.log("user is already exist");
            return Response.json({
                success: false,
                message: "user is already exist"
            },{status: 400})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save();
        console.log("user register successfully");
        return Response.json({
            success: true,
            message: "user register successfully"
        })
    } catch (error) {
        console.error("user registring error", error);
        return Response.json({
            success: false,
            message: "user registring error"
        },{status: 500})
    }
}

