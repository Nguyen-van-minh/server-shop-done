const express = require('express')
const router = express.Router()
const cloudinary = require('../utils/cloudinary')
const upload = require("../utils/multer");
const Slider = require('../modal/Slider')


router.post("/addSlider", upload.single("image"), async (req, res) => {
    try {
        console.log(req.body)
        const result = await cloudinary.uploader.upload(req.file.path);

        let slider = new Slider({
            title: req.body.title,
            description: req.body.description,
            color: req.body.color,
            img: result.secure_url,
            cloudinary_id: result.public_id
        });

        await slider.save();
        res.json({ success: true, slider });
    } catch (err) {
        console.log(err);
    }
});

// get all====================================
router.get('/', async (req, res) => {
    try {
        let sliders = await Slider.find({})
        res.json({ success: true, sliders })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'server error' })
    }
})


// Update ==================================================================================
router.put("/:id", upload.single("image"), async (req, res) => {
    try {

        let slider = await Slider.findById(req.params.id);
        // Delete image from cloudinary
        await cloudinary.uploader.destroy(slider.cloudinary_id);
        // Upload image to cloudinary
        let result;
        if (req.file) {
            result = await cloudinary.uploader.upload(req.file.path);
            // Delete image from cloudinary
            await cloudinary.uploader.destroy(slider.cloudinary_id);
        }
        const data = {
            _id: req.params.id,
            title: req.body.title || slider.title,
            description: req.body.description || slider.description,
            color: req.body.color || slider.color,
            img: result?.secure_url || slider.img,
            cloudinary_id: result?.public_id || slider.cloudinary_id,
        };

        slider = await Slider.findByIdAndUpdate(req.params.id, data, { new: true });

        res.json({ message: 'success', success: true, slider: data });
    } catch (err) {
        console.log(err);
    }
});


router.delete("/:id", async (req, res) => {
    try {
        let slider = await Slider.findById(req.params.id);
        await cloudinary.uploader.destroy(slider.cloudinary_id);
        await slider.remove();
        res.json({ message: 'success', success: true, slider });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router