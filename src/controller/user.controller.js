import UserModel from "../model/User.js"
import bcrypt from 'bcrypt'
import userValidation from "../services/user.service.js"

export default async function createUser(req, res){
    try {
        const {username, email, password, passwordConfirm} = req.body
        const userExistsByEmail = await UserModel.findOne({email: email})
        const userExistsByUsername = await UserModel.findOne({username: username})
        userValidation(username, email, password, passwordConfirm, res)
        if(userExistsByEmail){
            res.status(422).json({status: 'error', error: 'User already exists, please use another email'})
            return undefined
        }else if(userExistsByUsername){
            res.status(422).json({status: 'error', error: 'User already exists, please use another username'})
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