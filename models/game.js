const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gameSchema = new Schema ({
    title: String,
    platform: String,
    paid: Number,
    status: String,
    image: {
         url: { type: String, required: true},
         cloudinary_id: { type: String, required: true}
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Game', gameSchema)