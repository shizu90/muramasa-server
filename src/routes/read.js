import UserModel from "../model/User.js"
import parseJwt from "../utils/parseJWT.js"

export default function readRoutes(app) {
    
    //Get api health
    app.get('/api/health', (req, res) => {
        res.json({status: 'ok'})
    })

    //Get all users    
    app.get('/api/user/all', async (req, res) => {
        const users = await UserModel.find()
        res.status(200).json({users})
    })

    //Get user by username or token
    app.get('/api/user/:param', async (req, res) => {
        const param = req.params.param
        const id = param.length > 14 ? parseJwt(param) : undefined
        const user = param.length > 14 ? await UserModel.findById(id, '-password -_id') : await UserModel.findOne({username: param}, '-password -_id')
        if(!user){
            return res.status(404).json({status: 'error', error: 'User not found'})
        }
        res.status(200).json({user})
    })

    //Check if account's id with username passed in params is equal to token
    app.get('/api/user/:username/:token', async (req, res) => {
        const username = req.params.username
        const token = req.params.token
        const idByToken = parseJwt(token)
        const user = await UserModel.findOne({username: username}, '-password')
        if(!user){
            res.status(404).json({status: 'error', error: 'That user doesnt exists'})
        }
        if(user){
            if(user._id.toString() === idByToken){
                res.status(200).json({status: 'success', success: true})
            }else{
                res.status(200).json({status: 'success', success: false})
            }
        }
    })

    //Get user anime list
    app.get('/api/user/:token/get/animelist', async(req, res) => {
        const token = req.params.token
        const id = parseJwt(token)
        const user = await UserModel.findById(id, '-password')
        if(!user){
            return res.status(404).json({status: 'error', error: 'User not found'})
        }

        res.status(200).json({user: user.animeList})
    })

    //Get media of user list
    app.get('/api/user/:token/get/userList/:type/:id', async(req, res) => {
        const token = req.params.token
        const type = req.params.type
        const id = parseJwt(token)
        const mediaId = req.params.id
        const user = await UserModel.findById(id, '-password')
        const list = type === 'anime' ? user.animeList : user.mangaList
        if(!user){
            return res.status(404).json({status: 'error', error: 'User not found'})
        }
        for(let i=0;i<Object.keys(list).length;i++){
            const current = list[`${Object.keys(list)[i]}`]
            for(let j=0;j<current.length;j++){
                if(mediaId === current[j].id){
                    return res.status(200).json({media: current[j]})
                }
            }
        }
        return res.status(200).json({media: undefined})
    })

    //Get user manga list
    app.get('/api/user/:token/get/mangalist', async(req, res) => {
        const token = req.params.token
        const id = parseJwt(token)
        const user = await UserModel.findById(id, '-password')
        if(!user){
            return res.status(404).json({status: 'error', error: 'User not found'})
        }
        res.status(200).json({user: user.mangaList})
    })

    //Get user favorites anime or manga
    app.get('/api/user/:token/get/favorites', async(req, res) => {
        const token = req.params.token
        const id = parseJwt(token)
        const user = await UserModel.findById(id, '-password')
        if(!user){
            return res.status(404).json({stauts: 'error', error: 'User not found'})
        }
        return res.status(200).json({favoritesAnime: user.favoritesAnime, favoritesManga: user.favoritesManga})
    })
}