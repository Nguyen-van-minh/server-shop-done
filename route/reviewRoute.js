const express = require('express')
const router = express.Router()

const Review = require('../modal/Review')

router.post('/addReview', async (req, res) => {
    const { star, comment, productId, userName } = req.body
    try {
        let newReview = new Review({
            star: star,
            comment: comment,
            productId: productId,
            userName: userName
        })
        newReview = await newReview.save()
        res.json({ success: true, message: 'Review thành công', review: newReview })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'server error review' })
    }
})

// get all====================================
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({})
        res.json({ success: true, reviews })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Get all reviews server error' })
    }
})

// Delete ==========================================================
router.delete('/:id', async (req, res) => {
    try {
        const ReviewDelete = { _id: req.params.id }
        const deletereview = await Review.findOneAndDelete(ReviewDelete)

        if (!deletereview)
            return res.status(401).json({
                success: false,
                message: 'Không tồn tại review'
            })

        res.json({ success: true, review: deletereview })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Review server error' })
    }
})

module.exports = router