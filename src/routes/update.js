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
}