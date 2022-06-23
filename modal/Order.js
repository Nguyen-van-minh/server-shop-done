
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    userID: {
        type: String
    },
    userName: {
        type: String,
    },
    position: {
        type: String,
    },
    Address: {
        type: [String],
    },
    phoneNumber: {
        type: String,
    },
    payType: {
        type: String,
    },
    total: {
        type: Number,
    },
    state: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: "không có ghi chú!"
    },
    ListProductId: [String],
    ListProductImg: [String],
    ListProductName: [String],
    ListProductTotal: [String],
    ListProductColor: [String],
    ListProductSize: [String],
    quantityProduct: [String],

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('order', OrderSchema)

