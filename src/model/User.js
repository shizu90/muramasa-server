import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    animeList: {type: Object, required: true},
    mangaList: {type: Object, required: true},
    favorites: {type: Array, required: true}
}, { collection: 'users'})

const UserModel = mongoose.model('UserSchema', UserSchema)

export default UserModel