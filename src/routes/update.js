import parseJwt from "../utils/parseJWT.js"
import { manageList, manageFavorites } from "../services/list.service.js"
import UserModel from "../model/User.js"


export default function updateRoutes(app){

    
    //Manage user anime and manga list
    app.put('/api/user/:token/userLists/:method', async(req, res) => {
        const token = req.params.token
        const id = parseJwt(token)
        const method = req.params.method
        const {media} = req.body
        const user = await UserModel.findById(id, '-password')
        manageList(method, media, user)
    })

    //Manage user favorites anime 
    app.put('/api/user/:token/userFavorites/:method', async(req, res) => {
        const token = req.params.token
        const id = parseJwt(token)
        const method = req.params.method
        const {media} = req.body
        const user = await UserModel.findById(id, '-password')
        const favoriteList = media.type === 'anime' ? user.favoritesAnime : user.favoritesManga
        manageFavorites(method, media, user)
        if(favoriteList.length < 5){
            res.status(200).json({status: 'success', success: 'Favorited successfully'})
        }else{  
            res.status(200).json({status: 'error', error: 'Already have 5 favorites in list, max length is 5'})
        }
    })

    app.put('/api/user/:token/info', async(req, res) => {
        const token = req.params.token
        const {username, bio, propic} = req.body
        const id = parseJwt(token)
        const user = await UserModel.findById(id, '-password')
        if(!user){
            res.status(404).json({status: 'error', error: 'User not found'})
        }
        if(username.length > 0 || username !== user.username){
            await user.updateOne({username: username})
        }
        if(bio.length > 0 || username !== user.bio){
            await user.updateOne({bio: bio})
        }
        if(propic.length > 0){
            await user.updateOne({propic: propic})
        }
        res.status(200).json({status: 'success', success: 'Updated info successfully'})
    })
}