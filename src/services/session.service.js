export default async function sessionValidation(email, password, response){
    if(!email){
        response.status(422).json({status: 'error', error: 'Invalid email'})
    }
    if(!password){
        response.status(422).json({status: 'error', error: 'Invalid password'})
    }
}