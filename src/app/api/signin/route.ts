import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dbConnection from '@/lib/dbConnect';
import userModel from '@/models/register';

export async function POST(request: Request) {
  await dbConnection();

  try {
    const { email, password } = await request.json();

    // Find user in database
    const user = await userModel.findOne({email});
    if (!user) {
      return Response.json({
        success: false,
        message: 'Invalid credentials'
      },{status: 400})
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json({
        success: false,
        message: 'Invalid credentials'
      },{status: 400})
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '1h' }
    );

    // Return token to client
    return Response.json({
      success: true,
      message: "user successfully signin",
      token
    })
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({
      success: false,
      message: 'Internal server error' 
    },{status: 500})
  }
};