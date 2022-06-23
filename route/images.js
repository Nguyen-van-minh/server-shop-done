const express = require('express')
const router = express.Router()
const cloudinary = require('../utils/cloudinary')
const upload = require("../utils/multer");
const Image = require('../modal/Images')


router.post("/addImage", upload.single("image"), async (req, res) => {
    try {
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        let image = new Image({
            productID: req.body.productID,
            image: result.secure_url,
            cloudinary_id: result.public_id
        });

        await image.save();
        res.json({ success: true, image });
    } catch (err) {
        console.log(err);
    }
});

// get all by id====================================
router.post('/FindByProduct', async (req, res) => {
    try {
        let images = await Image.find({ productID: req.body.productID })
        res.json({ success: true, images })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Get all image server error' })
    }
})

// get all 
router.get('/', async (req, res) => {
    let { productID } = req.body
    try {
        let images = await Image.find({})
        res.json({ success: true, images })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Get all image server error' })
    }
})


// Delete ==============================================
router.delete("/:id", async (req, res) => {
    try {
        let image = await Image.findById(req.params.id);
        await cloudinary.uploader.destroy(image.cloudinary_id);
        await image.remove();
        res.json({ success: true, image });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router