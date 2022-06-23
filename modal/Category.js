const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true //khong dc giong nhau
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('category', CategorySchema)

