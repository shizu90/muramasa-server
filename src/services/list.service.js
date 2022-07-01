import UserModel from '../model/User.js'


export async function manageList(method, media, user){
    const properties = []
    UserModel.schema.eachPath((path) => {
        if(path.slice(0,9) === `${media.type}List`){
            properties.push(path)
        }
    })
    if(media.id){
        for(let i = 0; i<properties.length; i++){
            if(media.progress === properties[i].slice(10)){
                if(method === 'add'){
                    await user.updateOne({$addToSet: {[`${properties[i]}`]: media}})
                }else if(method === 'delete'){
                    await user.updateOne({$pull: {[`${properties[i]}`]: media}})
                }else if(method === 'update'){
                    const current = media.type === 'anime' ? user.animeList[`${properties[i].slice(10)}`] : user.mangaList[`${properties[i].slice(10)}`]
                    for(let j=0; j<current.length;j++){
                        if(media.id === current[j].id){
                            await user.updateOne({$pull: {[`${properties[i]}`]: current[j]}})
                        }
                    }
                    for(const stat in properties){
                        const current = media.type === 'anime' ? user.animeList[`${properties[stat].slice(10)}`] : user.mangaList[`${properties[stat].slice(10)}`]
                        for(let j=0;j<current.length;j++){
                            if(media.id === current[j].id){
                                await user.updateOne({$pull: {[`${properties[stat]}`]: current[j]}})
                            }
                        }
                    }
                    await user.updateOne({$addToSet: {[`${properties[i]}`]: media}})
                }
            }
        }
    }
}

export async function manageFavorites(method, media, user){
    const favoritesLength = 5
    const list = media.type === 'anime' ? user.animeList : user.mangaList
    const favoritesList = media.type === 'anime' ? user.favoritesAnime : user.favoritesManga
    const property = media.type === 'anime' ? 'favoritesAnime' : 'favoritesManga'
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
            for(let i=0;i<favoritesList.length;i++){
                if(favoritesList[i].id === media.id){
                    exists = true
                    await user.updateOne({$pull: {[`${property}`]: favoritesList[i]}})
                    await user.updateOne({$addToSet: {[`${property}`]: media}})
                    break
                }else{
                    exists = false
                }
            }
            if(exists === false){
                if(favoritesList.length < favoritesLength){
                    await user.updateOne({$addToSet: {[`${property}`]: media}})
                }    
            }
        }else{
            let exists
            for(let i=0;i<favoritesList.length;i++){
                if(favoritesList[i].id === media.id){
                    exists = true
                    await user.updateOne({$pull: {[`${property}`]: favoritesList[i]}})
                }else{
                    exists = false
                }
            }
            for(const stat in properties){
                const current = list[`${properties[stat].slice(10)}`]
                for(let i=0;i<current.length;i++){
                    if(current[i].id === media.id && current[i].favorited === media.favorited){
                        const temp = current[i]
                        await user.updateOne({$pull: {[`${properties[stat]}`]: temp}})
                        temp.favorited = false
                        await user.updateOne({$addToSet: {[`${properties[stat]}`]: temp}})
                    }
                }
            }
            if(exists === false){
                await user.updateOne({$pull: {[`${property}`]: media}})
            }
        }  
    }
        
}