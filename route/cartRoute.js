const express = require('express')
const router = express.Router()

const Cart = require('../modal/Cart')

router.post('/addToCart', async (req, res) => {
    const { productId, userId, productName, img, price, quantity, color, size, total } = req.body

    try {
        let cartItem = await Cart.find({ productId: productId });
        let newCartItem
        let dataChange
        if (cartItem) {
            cartItem.map(async item => {
                if (item.color === color && item.size === size) {
                    dataChange = {
                        productId: item.productId,
                        userId: item.userId,
                        price: price,
                        quantity: item.quantity + quantity,
                        total: price * quantity,
                        img: item.img,
                        productName: item.productName,
                        color: item.color,
                        size: item.size,
                    };
                    newCartItem = dataChange
                    await Cart.findByIdAndUpdate(item._id, dataChange, { new: true });
                }
            })

            if (!dataChange) {
                newCartItem = new Cart({ productId, userId, productName, img, price, quantity, total, color, size })
                await newCartItem.save()
            }
        }

        else {
            newCartItem = new Cart({ productId, userId, productName, img, price, quantity, total, color, size })
            await newCartItem.save()
        }

        res.json({ success: true, message: 'Thêm vào giỏ thành công', item: newCartItem })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'server error cart' })
    }
})

// get all by user id====================================
router.post('/', async (req, res) => {
    try {
        let items = await Cart.find({ userId: req.body.userId })
        res.json({ success: true, items })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Get items in cart server error' })
    }
})


// Update===================================================

router.put('/:id', async (req, res) => {
    try {
        const { quantity, total } = req.body
        let cartItem = await Cart.findById(req.params.id);
        const data = {
            productId: cartItem.productId,
            userId: cartItem.userId,
            price: cartItem.price,
            quantity: quantity,
            total: total,
            img: cartItem.img,
            productName: cartItem.productName,
            color: cartItem.color,
            size: cartItem.size,
        };

        cartItem = await Cart.findByIdAndUpdate(req.params.id, data, { new: true });

        res.json({ message: 'success', success: true, cartItem: data });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Cart server error' })
    }
})

// Delete ==========================================================
router.delete('/:id', async (req, res) => {
    try {
        const CartDeleteCondition = { _id: req.params.id }
        const deleteItem = await Cart.findOneAndDelete(CartDeleteCondition)

        if (!deleteItem)
            return res.status(401).json({
                success: false,
                message: 'Không tồn tại sản phẩm trong giỏ'
            })

        res.json({ success: true, cartItem: deleteItem })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Cart server error' })
    }
})

// Delete many ==========================================================
router.delete('/deleteManyItems/:id', async (req, res) => {
    try {
        const deleteAllItems = await Cart.deleteMany({ userId: req.params.id })

        if (!deleteAllItems)
            return res.status(401).json({
                success: false,
                message: 'Không tồn tại sản phẩm trong giỏ'
            })

        res.json({ success: true, cartItem: deleteAllItems })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Cart server error' })
    }
})

module.exports = router