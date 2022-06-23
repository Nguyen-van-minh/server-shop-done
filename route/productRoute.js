const express = require('express')
const router = express.Router()
const cloudinary = require('../utils/cloudinary')
const upload = require("../utils/multer");
const Product = require('../modal/Product')
const Image = require('../modal/Images')




router.post("/addProduct", upload.single("image"), async (req, res) => {
    try {

        const result = await cloudinary.uploader.upload(req.file.path);
        let sale = req.body.price * ((100 - req.body.discount) / 100)

        let product = new Product({
            name: req.body.name,
            categoryID: req.body.categoryID,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description,
            discount: sale,
            image: result.secure_url,
            color: JSON.parse(req.body.color),
            size: JSON.parse(req.body.size),
            cloudinary_id: result.public_id
        });

        await product.save();
        res.json({ success: true, product });
    } catch (err) {
        console.log(err);
    }
});

// router.post('/up', async (req, res) => {
//     try {
//         let a = await Product.find({})
//         await Promise.all(a.map(async (item, index) => {
//             await Product.findByIdAndUpdate(item._id, {
//                 sold: 0
//             }, { new: true });
//         }))
//         res.json({ success: true, a });
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ success: false, message: 'Get all product server error' })
//     }
// })

// get all====================================

router.get('/', async (req, res) => {
    try {
        let products = await Product.find({})

        res.json({ success: true, products })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Get all product server error' })
    }
})

router.get('/name', async (req, res) => {
    try {
        let products = await Product.find({ name: /thắt lưng/i })

        res.json({ success: true, products })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Get all product server error' })
    }
})

// get ban chay
router.get('/banchay', async (req, res) => {
    try {
        let products = await Product.find({}).sort({ sold: -1 }).limit(8)
        res.json({ success: true, products })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Get all product server error' })
    }
})

// get ban chay
router.get('/phobien', async (req, res) => {
    try {
        let products = await Product.find({}).sort({ quantity: -1 }).limit(8)
        res.json({ success: true, products })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Get all product server error' })
    }
})


// Update ==================================================================================
router.put("/:id", upload.single("image"), async (req, res) => {
    try {

        let product = await Product.findById(req.params.id);
        // Delete image from cloudinary
        // await cloudinary.uploader.destroy(product.cloudinary_id);
        // Upload image to cloudinary
        let result;
        if (req.file) {
            result = await cloudinary.uploader.upload(req.file.path);
            // Delete image from cloudinary
            await cloudinary.uploader.destroy(product.cloudinary_id);
        }
        let sale
        if (req.body.discount) {
            sale = req.body.price * ((100 - req.body.discount) / 100)
        }

        const data = {
            _id: req.params.id,
            name: req.body.name || product.name,
            categoryID: req.body.categoryID || product.categoryID,
            price: req.body.price || product.price,
            quantity: req.body.quantity || product.quantity,
            description: req.body.description || product.description,
            image: result?.secure_url || product.image,
            discount: sale || product.discount,
            color: JSON.parse(req.body.color) || product.color,
            size: JSON.parse(req.body.size) || product.size,
            cloudinary_id: result?.public_id || product.cloudinary_id,
        };

        product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });

        res.json({ message: 'success', success: true, product: data });
    } catch (err) {
        console.log(err);
    }
});


// Update quantity when order ==================================================================================
router.post("/updateQuantity", async (req, res) => {
    try {
        let { listId, listQuantity } = req.body

        await Promise.all(listId.map(async (productId, index) => {
            let product = await Product.findById(productId);
            await Product.findByIdAndUpdate(productId, {
                quantity: product.quantity - listQuantity[index],
                sold: listQuantity[index]
            }, { new: true });
        }))
        res.json({ message: 'success', success: true });
    } catch (err) {
        console.log(err);
    }
});




router.delete("/:id", async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        let images = await Image.find({ productID: req.params.id })
        await Promise.all(images.map(async item => {
            let image = await Image.findById(item._id); //db
            await cloudinary.uploader.destroy(item.cloudinary_id); //delete cloud
            await image.remove(); //delete db
        }))
        await cloudinary.uploader.destroy(product.cloudinary_id);
        await product.remove();
        res.json({ message: 'success', success: true, product });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router