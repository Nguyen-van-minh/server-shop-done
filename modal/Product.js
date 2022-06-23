const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true //khong dc giong nhau
    },
    categoryID: {
        type: String
    },
    price: {
        type: Number,
        default: 1
    },
    discount: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 1
    },
    sold: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: "không có mô tả!"
    },
    image: {
        type: String,
    },

    color: [String],
    size: [String],
    cloudinary_id: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('product', ProductSchema)

