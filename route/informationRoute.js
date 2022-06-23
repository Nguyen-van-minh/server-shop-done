const express = require('express')
const router = express.Router()
const cloudinary = require('../utils/cloudinary')
const upload = require("../utils/multer");
const Infomation = require('../modal/Information')


router.post("/addInformation", upload.single("image"), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);

        let infomation = new Infomation({
            sdtLienHe: req.body.sdtLienHe,
            sdtKhieuNai: req.body.sdtKhieuNai,
            sdtThacMac: req.body.sdtThacMac,
            introduce: req.body.introduce,
            bannerImage: result.secure_url,
            cloudinary_id: result.public_id
        });

        await infomation.save();
        res.json({ success: true, infomation });
    } catch (err) {
        console.log(err);
    }
});

// get all====================================
router.get('/', async (req, res) => {
    try {
        let informations = await Infomation.find({})
        res.json({ success: true, informations })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: ' server error' })
    }
})


// Update ==================================================================================
router.put("/:id", upload.single("image"), async (req, res) => {
    try {

        let information = await Infomation.findById(req.params.id);
        let result = req.file;
        if (result) {
            result = await cloudinary.uploader.upload(req.file.path);
            await cloudinary.uploader.destroy(information.cloudinary_id);
        }
        const data = {
            sdtLienHe: req.body.sdtLienHe,
            sdtKhieuNai: req.body.sdtKhieuNai,
            sdtThacMac: req.body.sdtThacMac,
            introduce: req.body.introduce,
            bannerImage: result?.secure_url || information.bannerImage,
            cloudinary_id: result?.public_id || information.cloudinary_id
        };

        information = await Infomation.findByIdAndUpdate(req.params.id, data, { new: true });

        res.json({ message: 'success', success: true, newInformation: data });
    } catch (err) {
        console.log(err);
    }
});


module.exports = router