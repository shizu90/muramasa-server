import createUser from './controller/user.controller.js'
import logger from './utils/logger.js'
import UserModel from './model/User.js'
import jwt from 'jsonwebtoken'
import parseJwt from './utils/parseJWT.js'
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

    app.get('/api/user/:token', async (req, res) => {
        const token = req.params.token
        const id = parseJwt(token)
        const user = await UserModel.findById(id, '-password')
        if(!user){
            return res.status(404).json({status: 'error', error: 'User not found'})
        }
        res.status(200).json({user})
    })

    app.get('/api/user/:token/animelist', async(req, res) => {
        const token = req.params.token
        const id = parseJwt(token)
        const user = await UserModel.findById(id, '-password')
        if(!user){
            return res.status(404).json({status: 'error', error: 'User not found'})
        }

        res.status(200).json({user: user.animeList})
    })

    app.get('/api/user/:token/mangalist', async(req, res) => {
        const token = req.params.token
        const id = parseJwt(token)
        const user = await UserModel.findById(id, '-password')
        if(!user){
            return res.status(404).json({status: 'error', error: 'User not found'})
        }
        res.status(200).json({user: user.mangaList})
    })

    app.get('/api/user/:token/favorites', async(req, res) => {
        const token = req.params.token
        const id = parseJwt(token)
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

    app.put('/api/user/:token/animelist/:method', async (req, res) => {
        const token = req.params.token
        const id = parseJwt(token)
        const method = req.params.method
        const {anime, status} = req.body
        console.log(anime)
        manageAnimeList(method, anime, status, id, res)
    })

    app.put('/api/user/:token/mangalist/:method', async (req, res) => {
        const token = req.params.token
        const id = parseJwt(token)
        const method = req.params.method
        const {manga, status} = req.body
        manageMangaList(method, manga, status, id, res)
    })

    app.put('/api/user/:token/favorites/:method', async(req, res) => {
        const token = req.params.token
        const id = parseJwt(token)
        const method = req.params.method
        const {media} = req.body
        const user = await UserModel.findById(id, '-password')
        if(!user){
            res.status(404).json({status: 'error', error: 'User not found'})
        }
        if(method === 'push'){
            await user.updateOne({$addToSet: {favorites: media}})
            res.status(200).json({status: 'success', success: user.favorites})
        }else{
            await user.updateOne({$pull: {favorites: media}})
            res.status(200).json({status: 'success', success: user.favorites})
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

            res.status(200).json({status: 'success', success: 'Succesfully auth fulfillment', token})
        }catch(e){
            logger.error(e)
            res.status(500).json({status: 'error', error: 'Occurred an error on the server'})
        }
    })

}