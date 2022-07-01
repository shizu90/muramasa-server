import parseJwt from "../utils/parseJWT.js"
import createUser from "../controller/user.controller.js"
import logger from '../utils/logger.js'
import sessionValidation from "../services/session.service.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from "../model/User.js"

export default function postRoutes(app){
    app.post('/api/user/register', async (req, res) => {   
        try {
            const user = await createUser(req, res)
            if(user === undefined){
                logger.info(`User already exists`)
            }else{
                logger.info(`User created successfully: ${user}`)
                res.status(200).json({status: 'success', success: `User ${user.username} created successfully`})
            }
        }catch(e){
            res.json({status: 'error', message: `${e.message}`})
        }
    })

    app.post('/api/user/login', async (req, res) => {
        const {email, password} = req.body
        sessionValidation(email, password, res)
        const user = await UserModel.findOne({email: email})
        if(!user){
            return res.status(404).json({status: 'error', error: 'User not found'})
        }
        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword){
            return res.status(422).json({status: 'error', error: 'Invalid password'})
        }
        if(!user){
            return res.status(404).json({status: 'error', error: 'User not found'})
        }
        try{
            const secret = process.env.SECRET
            const token = jwt.sign({
                id: user._id,
            }, secret)

            res.status(200).json({status: 'success', success: `Succesfully logged as ${user.username}`, token, username: user.username})
        }catch(e){
            logger.error(e)
            res.status(500).json({status: 'error', error: 'Occurred an error on the server'})
        }
    })
}