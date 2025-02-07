import jwt from "jsonwebtoken"
import User from "../models/user.js"

export default async function validateToken (req, res, next) {

    try {
        console.log("RUNNING TOKEN VALIDATION")
    //! 1) check the authorization is present on the request
            const authHeader = req.headers.authorization

    //! 2) if header not present, send a 401
            if (!authHeader) {
                throw new Error("No authorization was present on the request")
            } 

    //! 3) if the header is present, is it the correct syntax? ie bearer token etc
    //! 4) if the header is invalid, send a 401
            if (!authHeader.startsWith("Bearer ")) {
                throw new Error("invalid header syntax")
            }

    //! 5) if the header is valid, verify the token (this will verify the secret and the expiry)
            const token = authHeader.replace("Bearer ", "")
            const payload = jwt.verify(token, process.env.TOKEN_SECRET)

    //! 6) if the token is valid, ensure the user still exists
            const user = await User.findById(payload.user._id)

    //! 7) if the user is not found, send a 401
             if (!user) throw new Error("token valid, but user not found")

    //! 8) if the user is found, pass it to the controller
            req.user = user

    //! 9) if we reach this point, we run next() to pass the request to the controller
            next()
        } catch (error) {
            console.log(error) 
            //* if the token is invalid, send a 401
            return res.status(401).json({ message: "invalid token" })
        }
    }
