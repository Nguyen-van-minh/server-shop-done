const express = require('express')
const router = express.Router()

const Category = require('../modal/Category')

router.post('/addCategory', async (req, res) => {
    const { name } = req.body
    console.log(req.body.name)
    if (!name)
        return res
            .status(400)
            .json({ success: false, message: 'Chưa nhập tên danh mục' })

    try {
        const category = await Category.findOne({ name })
        if (category)
            return res
                .status(400)
                .json({ success: false, message: 'danh mục tồn tại' })

        const newCategory = new Category({ name })
        await newCategory.save()

        res.json({ success: true, message: 'Tạo danh mục thành công', category: newCategory })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'server error category' })
    }
})

// get all====================================
router.get('/', async (req, res) => {
    try {
        const categorys = await Category.find({})
        res.json({ success: true, categorys })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Get all category server error' })
    }
})

// Update===================================================

router.put('/:id', async (req, res) => {
    const { name } = req.body
    if (!name)
        return res
            .status(400)
            .json({ success: false, message: 'Chưa nhập tên danh mục' })
    try {
        let updatedCategory = { name }
        const categoryUpdateCondition = { _id: req.params.id }

        updatedCategory = await Category.findOneAndUpdate(
            categoryUpdateCondition,
            updatedCategory,
            { new: true }
        )

        if (!updatedCategory)
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            })

        res.json({
            success: true,
            message: 'Thành công!',
            category: updatedCategory
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Category server error' })
    }
})

// Delete ==========================================================
router.delete('/:id', async (req, res) => {
    try {
        const CategoryDeleteCondition = { _id: req.params.id }
        const deletedCategory = await Category.findOneAndDelete(CategoryDeleteCondition)

        if (!deletedCategory)
            return res.status(401).json({
                success: false,
                message: 'Không tồn tại danh mục'
            })

        res.json({ success: true, category: deletedCategory })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Category server error' })
    }
})

module.exports = router