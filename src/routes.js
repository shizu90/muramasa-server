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

    app.get('/api/user/:id/animelist', async(req, res) => {
        const id = req.params.id
        const user = await UserModel.findById(id, '-password')
        if(!user){
            return res.status(404).json({status: 'error', error: 'User not found'})
        }

        res.status(200).json({user: user.animeList})
    })

    app.get('/api/user/:id/mangalist', async(req, res) => {
        const id = req.params.id
        const user = await UserModel.findById(id, '-password')
        if(!user){
            return res.status(404).json({status: 'error', error: 'User not found'})
        }
        res.status(200).json({user: user.mangaList})
    })

    app.post('/api/user/register', async (req, res) => {   
        try {
            const user = await createUser(req, res)
            console.log(`User created successfully: ${user}`)
            res.json({body: req.body})
        }catch(e){
            res.json({status: 'error', message: `${e.message}`})
        }
    })

    app.put('/api/user/:id/animelist/:anime/:status', async (req, res) => {
        const id = req.params.id
        const anime = req.params.anime
        const status = req.params.status
        if(anime.id){
            if(status === 'watching'){
                const user = await UserModel.findOneAndUpdate({_id: id}, {$addToSet: {'animeList.watching': anime}})
                if(!user){
                    return res.status(404).json({status: 'error', error: 'User not found'})
                }
                res.status(200).json({status: 'success', success: user.animeList})
            }
            else if(status === 'completed'){
                const user = await UserModel.findOneAndUpdate({_id: id}, {$addToSet: {'animeList.completed': anime}})
                if(!user){
                    return res.status(404).json({status: 'error', error: 'User not found'})
                }
                res.status(200).json({status: 'success', success: user.animeList}) 
            }
            else if(status === 'dropped'){
                const user = await UserModel.findOneAndUpdate({_id: id}, {$addToSet: {'animeList.dropped': anime}})
                if(!user){
                    return res.status(404).json({status: 'error', error: 'User not found'})
                }
                res.status(200).json({status: 'success', success: user.animeList})
            }
            else if(status === 'plans'){
                const user = await UserModel.findOneAndUpdate({_id: id}, {$addToSet: {'animeList.plans': anime}})
                if(!user){
                    return res.status(404).json({status: 'error', error: 'User not found'})
                }
                res.status(200).json({status: 'success', success: user.animeList})    
            }else{
                res.status(404).json({status: 'error', error: 'Status not found'})
            }
        }else{
            res.status(400).json({status: 'error', error: 'Invalid param type'})
        }
    })

    app.put('/api/user/:id/mangalist/:manga/:status', async (req, res) => {
        const id = req.params.id
        const manga = req.params.manga
        const status = req.params.status
        if(manga.id){
            if(status === 'reading'){
                const user = await UserModel.findOneAndUpdate({_id: id}, {$addToSet: {'mangaList.reading': manga}})
                if(!user){
                    return res.status(404).json({status: 'error', error: 'User not found'})
                }
                res.status(200).json({status: 'success', success: user.mangaList})
            }
            else if(status === 'completed'){
                const user = await UserModel.findOneAndUpdate({_id: id}, {$addToSet: {'mangaList.completed': manga}})
                if(!user){
                    return res.status(404).json({status: 'error', error: 'User not found'})
                }
                res.status(200).json({status: 'success', success: user.mangaList}) 
            }
            else if(status === 'dropped'){
                const user = await UserModel.findOneAndUpdate({_id: id}, {$addToSet: {'mangaList.dropped': manga}})
                if(!user){
                    return res.status(404).json({status: 'error', error: 'User not found'})
                }
                res.status(200).json({status: 'success', success: user.mangaList})
            }
            else if(status === 'plans'){
                const user = await UserModel.findOneAndUpdate({_id: id}, {$addToSet: {'mangaList.plans': manga}})
                if(!user){
                    return res.status(404).json({status: 'error', error: 'User not found'})
                }
                res.status(200).json({status: 'success', success: user.mangaList})    
            }else{
                res.status(404).json({status: 'error', error: 'Status not found'})
            }
        }else{
            res.status(400).json({status: 'error', error: 'Invalid param type'})
        }
    })

    app.put('/api/user/:id/animelist/:anime/:status/delete', async (req, res) => {
        
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

            res.status(200).json({status: 'success', success: 'Succesfully auth fulfillment', token, user: user._id})
        }catch(e){
            console.log(e)
            res.status(500).json({status: 'error', error: 'Occurred an error on the server'})
        }
    })

}