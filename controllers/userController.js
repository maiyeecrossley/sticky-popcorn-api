import express from 'express'
import User from '../models/user.js'
import { generateToken } from '../utils/token.js'

const router = express.Router()

router.post('/signup', async (req, res, next) => {
try {
    const user = await User.create(req.body)
    const token = generateToken(user)
    return res.status(201).json({
        message: 'User created successfully',
        token
    })
}catch(error) {
    next(error)
}
})


router.post('/signin', async (req,res,next) => {
try {
    const foundUser = await User.findOne({$or : [{username: req.body.identifier},
        {email: req.body.identifier}]})

if(!foundUser) {
    return res.status(401).json({message:'Invalid credentials'})
}

if(!foundUser.isPasswordValid(req.body.password))
    return res.status(401).json({message:'invalid credentials'})

const token = generateToken(foundUser)
return res.json({message:'Login successful', token})
}
catch(error){
    next(error)
}
}
)

export default router