import  {z} from "zod"

export const usernameValidation = z
    .string()
    .min(2, "username atleast 2 characters")
    .max(20, "username must be no more than 20 characters")
    // .regex(/^[a-zA-Z0-9_-]$/, "Please enter a valid username")

export const emailValidation = z
    .string()
    .email({message: "Invalid email address"})
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {message: "Please enter a valid email address"})

export const passwordValidation = z
    .string()
    .min(6, {message: "Password must be atleast 6 characters"})

export const signupSchema = z.object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation
})

