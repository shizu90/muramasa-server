import mongoose from 'mongoose'

const MediaSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    type: {type: String, required: true},
    count: {type: Number, required: true},
    progress: {type: String, required: true},
    favorited: {type: Boolean, required: true},
    data: {type: Object, required: true}
})

const MediaModel = mongoose.model('Media', MediaSchema)

export default MediaModel