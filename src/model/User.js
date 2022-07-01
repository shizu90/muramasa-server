import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    propic: {type: String},
    bio: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    animeList: {
        watching: [],
        completed: [],
        dropped: [],
        plans: [],
    },
    mangaList: {
        reading: [],
        completed: [],
        dropped: [],
        plans: []
    },
    favoritesAnime: Array(5),
    favoritesManga: Array(5)
}, { collection: 'users'})

const UserModel = mongoose.model('UserSchema', UserSchema)

export default UserModel