import UserModel from "../model/User.js"
import bcrypt from 'bcrypt'

export default async function createUser(req, res){
    try {
        const {username, email, password, passwordConfirm} = req.body
        const userExistsByEmail = await UserModel.findOne({email: email})
        const userExistsByUsername = await UserModel.findOne({username: username})
        if(!email || typeof email !== 'string' || !email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/)){
            res.status(422).json({status: 'error', error: 'Invalid email format'})
            return undefined
        }
        if(!username || typeof username !== 'string'){
            res.status(422).json({status: 'error', error: 'Invalid username'})
            return undefined
        }
        if(password.length < 6 || typeof password !== 'string' || password !== passwordConfirm){
            res.status(422).json({status: 'error', error: 'Password too short or confirmation doesnt match'})
            return undefined
        }
        if(userExistsByEmail){
            res.status(422).json({status: 'error', error: 'Email already in use'})
            return undefined
        }else if(userExistsByUsername){
            res.status(422).json({status: 'error', error: 'Username already taken'})
            return undefined
        }else{
            const user = UserModel.create({
                username, 
                email, 
                password: await bcrypt.hash(password, 10) 
            })      
            return user
        }
    }catch(e){
        console.log(`Failed to create an user: ${e.name}`)
    }
}