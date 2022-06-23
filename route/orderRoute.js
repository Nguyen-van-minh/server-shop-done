const express = require('express')
const router = express.Router()
const Order = require('../modal/Order')


router.post("/addOrder", async (req, res) => {
    try {
        let order = new Order({
            userID: req.body.userID,
            userName: req.body.userName,
            position: req.body.position,
            phoneNumber: req.body.phoneNumber,
            payType: req.body.payType,
            total: req.body.total,
            state: req.body.state,
            description: req.body.description,
            Address: req.body.Address,
            ListProductId: req.body.ListProductId,
            ListProductImg: req.body.ListProductImg,
            ListProductName: req.body.ListProductName,
            ListProductTotal: req.body.ListProductTotal,
            ListProductColor: req.body.ListProductColor,
            ListProductSize: req.body.ListProductSize,
            quantityProduct: req.body.quantityProduct,
        });

        await order.save();
        res.json({ success: true, order });
    } catch (err) {
        console.log(err);
    }
});

// get all by id====================================
router.post('/', async (req, res) => {
    try {
        let orders = await Order.find({ userID: req.body.userID })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Get orders server error' })
    }
})

// get all 
router.get('/', async (req, res) => {
    try {
        let orders = await Order.find({})
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Get orders server error' })
    }
})


// Update ==================================================================================
router.put("/:id", async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);

        const data = {
            _id: order._id,
            userID: order.userID,
            userName: order.userName,
            position: order.position,
            Address: order.Address,
            phoneNumber: order.phoneNumber,
            payType: order.payType,
            total: order.total,
            state: req.body.state,
            description: order.description,
            ListProductId: order.ListProductId,
            ListProductImg: order.ListProductImg,
            ListProductName: order.ListProductName,
            ListProductTotal: order.ListProductTotal,
            ListProductColor: order.ListProductColor,
            ListProductSize: order.ListProductSize,
            quantityProduct: order.quantityProduct,
        };

        order = await Order.findByIdAndUpdate(req.params.id, data, { new: true });

        res.json({ message: 'success', success: true, order: data });
    } catch (err) {
        console.log(err);
    }
});



router.delete("/:id", async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);
        await order.remove();
        res.json({ message: 'success', success: true, order });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router