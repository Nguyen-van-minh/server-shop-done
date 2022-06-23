const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    productId: {
        type: String
    },
    userName: {
        type: String
    },
    star: {
        type: Number
    },
    comment: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('review', ReviewSchema)

