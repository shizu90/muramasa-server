import createUser from './controller/user.controller.js'
import bcrypt from 'bcrypt'
import UserModel from './model/User.js'

export default function appRoutes(app){
    app.get('/api/health', (req, res) => {
        res.json({status: 'ok'})
    })
    
    app.get('/api/users', (req, res) => {

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
    })

}