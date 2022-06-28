export default function userValidation(username, email, password, passwordConfirm, res){
    if(!email || typeof email !== 'string' || !email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/)){
        res.status(422).json({status: 'error', error: 'Invalid email format'})
    }
    if(!username || typeof username !== 'string'){
        res.status(422).json({status: 'error', error: 'Invalid username'})
    }
    if(password.length < 6 || typeof password !== 'string' || password !== passwordConfirm){
        res.status(422).json({status: 'error', error: 'Password too short or confirmation doesnt match'})
    }
}