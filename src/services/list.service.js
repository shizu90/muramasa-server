import UserModel from '../model/User.js'

export async function manageAnimeList(method, anime, status, UID, response){
    const user = await UserModel.findById(UID, '-password')
    if(!user){
        return response.status(404).json({status: 'error', error: 'User not found'})
    }
    const properties = []
    UserModel.schema.eachPath((path) => {
        if(path.slice(0, 9) === 'animeList'){
            properties.push(path)   
        } 
    }) 
    if(anime.id){
        if(status === 'watching' && method === 'add'){
            user.updateOne({$addToSet: {[`animeList.watching`]: anime}})
        }
        for(let i = 0; i<properties.length; i++){
            if(status === properties[i].slice(10)){
                if(method === 'add'){
                    await user.updateOne({$addToSet: {[`${properties[i]}`]: anime}})
                    return response.status(200).json({status: 'success', sucess: user.animeList})
                }else if(method === 'delete'){
                    await user.updateOne({$pull: {[`${properties[i]}`]: anime}})
                    return response.status(200).json({status: 'success', success: user.animeList})
                }else if(method === 'update'){
                    const current = user.animeList[`${properties[i].slice(10)}`]
                    for(let j=0; j<current.length;j++){
                        if(anime.id === current[j].id){
                            await user.updateOne({$pull: {[`${properties[i]}`]: current[j]}})
                        }
                    }
                    for(const stat in properties){
                        const current = user.animeList[`${properties[stat].slice(10)}`]
                        for(let j=0;j<current.length;j++){
                            if(anime.id === current[j].id){
                                await user.updateOne({$pull: {[`${properties[stat]}`]: current[j]}})
                            }
                        }
                    }
                    await user.updateOne({$addToSet: {[`${properties[i]}`]: anime}})
                    return response.status(200).json({status: 'success', success: user.animeList})
                }
            }
        }  
    }else{
        response.status(404).json({status: 'error', error: 'Invalid anime type'})
    }
}
export async function manageMangaList(method, manga, status, UID, response){
    const user = await UserModel.findById(UID, '-password')
    if(!user){
        return response.status(404).json({status: 'error', error: 'User not found'})
    }
    const properties = []
    UserModel.schema.eachPath((path) => {
        if(path.slice(0, 9) === 'mangaList'){
            properties.push(path)   
        } 
    }) 
    if(manga.id){
        if(status === 'watching' && method === 'add'){
            user.updateOne({$addToSet: {[`mangaList.watching`]: manga}})
        }
        for(let i = 0; i<properties.length; i++){
            if(status === properties[i].slice(10)){
                if(method === 'add'){
                    await user.updateOne({$addToSet: {[`${properties[i]}`]: manga}})
                    return response.status(200).json({status: 'success', sucess: user.mangaList})
                }else if(method === 'delete'){
                    await user.updateOne({$pull: {[`${properties[i]}`]: manga}})
                    return response.status(200).json({status: 'success', success: user.mangaList})
                }else if(method === 'update'){
                    const current = user.mangaList[`${properties[i].slice(10)}`]
                    for(let j=0; j<current.length;j++){
                        if(manga.id === current[j].id){
                            await user.updateOne({$pull: {[`${properties[i]}`]: current[j]}})
                        }
                    }
                    for(const stat in properties){
                        const current = user.mangaList[`${properties[stat].slice(10)}`]
                        for(let j=0;j<current.length;j++){
                            if(manga.id === current[j].id){
                                await user.updateOne({$pull: {[`${properties[stat]}`]: current[j]}})
                            }
                        }
                    }
                    await user.updateOne({$addToSet: {[`${properties[i]}`]: manga}})
                    return response.status(200).json({status: 'success', success: user.mangaList})
                }
            }
        }  
    }else{
        response.status(404).json({status: 'error', error: 'Invalid manga type'})
    }
}
export async function manageFavorites(method, media, UID, response){
    const user = await UserModel.findById(UID, '-password')
    if(!user){
        return response.status(404).json({status: 'error', error: 'User not found'})
    }
    let list
    if(media.type === 'anime'){
        list = user.animeList
    }else{
        list = user.mangaList
    }
    const properties = []
    UserModel.schema.eachPath((path) => {
        if(path.slice(0, 9) === `${media.type}List`){
            properties.push(path)   
        } 
    })    
    if(media.id){
        if(method === 'add'){
            let exists = false
            for(const stat in properties){
                const current = list[`${properties[stat].slice(10)}`]
                for(let i=0;i<current.length;i++){
                    if(current[i].id === media.id && current[i].favorited !== media.favorited){
                        const temp = current[i]
                        await user.updateOne({$pull: {[`${properties[stat]}`]: temp}})
                        await user.updateOne({$addToSet: {[`${properties[stat]}`]: media}})
                    }
                }
            }
            for(let i=0;i<user.favorites.length;i++){
                if(user.favorites[i].id === media.id){
                    exists = true
                    await user.updateOne({$pull: {favorites: user.favorites[i]}})
                    await user.updateOne({$addToSet: {favorites: media}})
                    break
                }else{
                    exists = false
                }
            }
            if(exists === false){
                await user.updateOne({$addToSet: {favorites: media}})      
            }
        }else{
            let exists
            for(let i=0;i<user.favorites.length;i++){
                if(user.favorites[i].id === media.id){
                    exists = true
                    await user.updateOne({$pull: {favorites: user.favorites[i]}})
                }else{
                    exists = false
                }
            }
            if(exists === false){
                await user.updateOne({$pull: {favorites: media}})
            }
        }  
    }
        
}