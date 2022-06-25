import UserModel from '../model/User.js'

export async function manageAnimeList(method, anime, status, UID, response){
    if(anime.id){
        if(method === 'push'){
            if(status === 'watching'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$addToSet: {'animeList.watching': anime}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.animeList})
            }
            else if(status === 'completed'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$addToSet: {'animeList.completed': anime}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.animeList}) 
            }
            else if(status === 'dropped'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$addToSet: {'animeList.dropped': anime}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.animeList})
            }
            else if(status === 'plans'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$addToSet: {'animeList.plans': anime}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.animeList})    
            }else{
                response.status(404).json({status: 'error', error: 'Status not found'})
            }
        }else{
            if(status === 'watching'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$pull: {'animeList.watching': {id: anime.id}}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.animeList})
            }
            else if(status === 'completed'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$pull: {'animeList.completed': {id: anime.id}}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.animeList}) 
            }
            else if(status === 'dropped'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$pull: {'animeList.dropped': {id: anime.id}}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.animeList})
            }
            else if(status === 'plans'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$pull: {'animeList.plans': {id: anime.id}}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.animeList})    
            }else{
                response.status(404).json({status: 'error', error: 'Status not found'})
            }
        }
    }else{
        response.status(404).json({status: 'error', error: 'Status not found'})
    }
}

export async function manageMangaList(method, manga, status, UID, response){
    if(manga.id){
        if(method === 'push'){
            if(status === 'reading'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$addToSet: {'mangaList.reading': manga}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.mangaList})
            }
            else if(status === 'completed'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$addToSet: {'mangaList.completed': manga}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.mangaList}) 
            }
            else if(status === 'dropped'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$addToSet: {'mangaList.dropped': manga}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.mangaList})
            }
            else if(status === 'plans'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$addToSet: {'mangaList.plans': manga}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.mangaList})    
            }else{
                response.status(404).json({status: 'error', error: 'Status not found'})
            }
        }else{
            if(status === 'reading'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$pull: {'mangaList.reading': {id: manga.id}}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.mangaList})
            }
            else if(status === 'completed'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$pull: {'mangaList.completed': {id: manga.id}}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.mangaList}) 
            }
            else if(status === 'dropped'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$pull: {'mangaList.dropped': {id: manga.id}}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.mangaList})
            }
            else if(status === 'plans'){
                const user = await UserModel.findOneAndUpdate({_id: UID}, {$pull: {'mangaList.plans': {id: manga.id}}})
                if(!user){
                    return response.status(404).json({status: 'error', error: 'User not found'})
                }
                response.status(200).json({status: 'success', success: user.mangaList})    
            }else{
                response.status(404).json({status: 'error', error: 'Status not found'})
            }
        }
    }else{
        response.status(400).json({status: 'error', error: 'Invalid param type'})
    }
}