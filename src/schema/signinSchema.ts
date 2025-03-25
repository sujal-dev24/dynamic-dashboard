import  {z} from "zod"

export const signupSchema = z.object({
    identifier: z.string(),
    password: z.string()
})
