import mongoose from "mongoose";

export interface ConnectionProps{
    isConnected: boolean;
}

const connection: ConnectionProps = { isConnected: false };

export default async function dbConnection() {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return Response.json({
            success: false,
            message: "Already connected to database"
        },{status: 400});
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI!);
        connection.isConnected = db.connections[0].readyState === 1;
        console.log("Database connection successfully");
        return Response.json({
            success: true,
            message: "Database connection successfully"
        },{status: 200})
    } catch (error) {
        console.error("error fetch in database", error);
        process.exit(0);
    }
}