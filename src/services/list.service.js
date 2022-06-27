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