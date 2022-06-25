import createUser from './controller/user.controller.js'
import logger from './utils/logger.js'
import UserModel from './model/User.js'
import jwt from 'jsonwebtoken'
import { manageAnimeList, manageMangaList } from './services/list.service.js'
import sessionValidation from './services/session.service.js'

export default function appRoutes(app){
    app.get('/api/health', (req, res) => {
        res.json({status: 'ok'})
    })
    
    app.get('/api/user/all', async (req, res) => {
        const users = await UserModel.find()
        res.status(200).json({users})
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

    app.get('/api/user/:id/favorites', async(req, res) => {
        const id = req.params.id
        const user = await UserModel.findById(id, '-password')
        if(!user){
            return res.status(404).json({stauts: 'error', error: 'User not found'})
        }
        res.status(200).json({user: user.favorites})
    })

    app.post('/api/user/register', async (req, res) => {   
        try {
            const user = await createUser(req, res)
            if(user === undefined){
                res.status(400).json({status: 'error', error: 'User already created'})
                logger.info(`User already exists`)
            }else{
                logger.info(`User created successfully: ${user}`)
                res.status(200).json({body: req.body})
            }
        }catch(e){
            res.json({status: 'error', message: `${e.message}`})
        }
    })

    //Add or remove media to list

    app.put('/api/user/:id/animelist/:method', async (req, res) => {
        const id = req.params.id
        const method = req.params.method
        const {anime, status} = req.body
        manageAnimeList(method, JSON.parse(anime), status, id, res)
    })

    app.put('/api/user/:id/mangalist/:method', async (req, res) => {
        const id = req.params.id
        const method = req.params.method
        const {manga, status} = req.body
        manageMangaList(method, JSON.parse(manga), status, id, res)
    })

    app.put('/api/user/:id/favorites/:method', async(req, res) => {
        const id = req.params.id
        const method = req.params.method
        const {media} = req.body
        if(method === 'push'){
            await UserModel.findByIdAndUpdate({_id: id}, {$push: {favorites: media}})
            res.status(200)
        }else{
            await UserModel.findByIdAndUpdate({_id: id}, {$pull: {favorites: media}})
            res.status(200)
        }
    })

    app.post('/api/user/login', async (req, res) => {
        const {email, password} = req.body
        const user = await UserModel.findOne({email: email})
        sessionValidation(email, password, res, user)
        try{
            const secret = process.env.SECRET
            const token = jwt.sign({
                id: user._id,
            }, secret)

            res.status(200).json({status: 'success', success: 'Succesfully auth fulfillment', token, user: user._id})
        }catch(e){
            logger.error(e)
            res.status(500).json({status: 'error', error: 'Occurred an error on the server'})
        }
    })

}