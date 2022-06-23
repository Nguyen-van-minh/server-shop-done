const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const InformatitonSchema = new Schema({
    sdtLienHe: {
        type: String,
    },
    sdtKhieuNai: {
        type: String,
    },
    sdtThacMac: {
        type: String,
    },
    introduce: {
        type: String,
    },
    bannerImage: {
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

module.exports = mongoose.model('information', InformatitonSchema)

