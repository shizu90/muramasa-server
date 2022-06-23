import UserModel from "../model/User.js"
import bcrypt from 'bcrypt'
import userValidation from "../services/user.service.js"

export default async function createUser(req, res){
    try {
        const {username, email, password, passwordConfirm, animeList, mangaList, favorites} = req.body
        const userExists = await UserModel.findOne({email: email})
        userValidation(username, email, password, passwordConfirm, res)
        if(userExists){
            res.status(422).json({status: 'error', error: 'User already exists'})
            return undefined
        }else{
            const user = UserModel.create({username, email, password: await bcrypt.hash(password, 10), animeList, mangaList, favorites})        
            return user
        }
    }catch(e){
        console.log(`Failed to create an user: ${e.name}`)
    }
}