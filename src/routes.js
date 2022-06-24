import createUser from './controller/user.controller.js'
import bcrypt from 'bcrypt'
import UserModel from './model/User.js'
import jwt from 'jsonwebtoken'

export default function appRoutes(app){
    app.get('/api/health', (req, res) => {
        res.json({status: 'ok'})
    })
    
    app.get('/api/user/:id', async (req, res) => {
        const id = req.params.id
        const user = await UserModel.findById(id, '-password')
        if(!user){
            return res.status(404).json({status: 'error', error: 'User not found'})
        }
        res.status(200).json({user})
    })

    app.post('/api/user/register', async (req, res) => {   
        try {
            const user = await createUser(req, res)
            console.log(`User created successfully: ${user._id}`)
            res.json({body: req.body})
        }catch(e){
            res.json({status: 'error', message: `${e.message}`})
        }
    })

    app.post('/api/user/login', async (req, res) => {
        const {email, password} = req.body

        if(!email){
            return res.status(422).json({status: 'error', error: 'Invalid email'})
        }
        if(!password){
            return res.status(422).json({status: 'error', error: 'Invalid password'})
        }

        const user = await UserModel.findOne({email: email})

        if(!user){
            return res.status(404).json({status: 'error', error: 'User not found'})
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            return res.status(422).json({status: 'error', error: 'Invalid password'})
        }

        try{
            const secret = process.env.SECRET
            const token = jwt.sign({
                id: user._id,
            }, secret)

            res.status(200).json({status: 'success', success: 'Succesfully auth fulfillment', token})
        }catch(e){
            console.log(e)
            res.status(500).json({status: 'error', error: 'Occurred an error on the server'})
        }
    })

}