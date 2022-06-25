import bcrypt from 'bcrypt'

export default async function sessionValidation(email, password, response, user){
    if(!email){
        return response.status(422).json({status: 'error', error: 'Invalid email'})
    }
    if(!password){
        return response.status(422).json({status: 'error', error: 'Invalid password'})
    }
    if(!user){
        return response.status(404).json({status: 'error', error: 'User not found'})
    }
    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword){
        return response.status(422).json({status: 'error', error: 'Invalid password'})
    }
}