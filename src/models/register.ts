import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        min: 3,
        max: 20,
        // match: [/^[a-zA-Z0-9_-]$/, "Please enter a valid username"]
    },
    email: {
        type: String,
        required: [true, "Email address is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, 'Password must be at least 6 characters']
        // match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{6,}$/, "Please enter a valid password"]
    },
},{
    timestamps: true
})

const userModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("Usermodel", UserSchema);

export default userModel;

