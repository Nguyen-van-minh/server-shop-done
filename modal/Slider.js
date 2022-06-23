const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const SliderSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    img: {
        type: String,
    },
    color: {
        type: String,
    },
    cloudinary_id: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('slider', SliderSchema)

