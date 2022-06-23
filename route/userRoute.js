const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const User = require('../modal/User')
const verifyToken = require('../middleware/auth')



router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user)
            return res.status(400).json({ success: false, message: 'không thấy user' })
        res.json({ success: true, user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'server error' })
    }
})

router.get('/getAllUser', async (req, res) => {
    try {
        const ListUser = await User.find({})
        res.json({ success: true, ListUser })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'server error' })
    }
})


// Update===================================================
router.put('/:id', async (req, res) => {
    let { username, email, role, password } = req.body
    // const user = await User.findById(req.params.id).select('-password')
    const user = await User.findById(req.params.id)
    if (!user)
        return res
            .status(400)
            .json({ success: false, message: 'không tồn tại người dùng' })
    try {
        if (password) {
            password = await argon2.hash(password)
        }
        else {
            password = user.password
        }
        let updatedUser = {
            username: username || user.username,
            email: email || user.email,
            role: role || user.role,
            password: password
        }
        const userUpdateCondition = { _id: req.params.id }

        updatedUser = await User.findOneAndUpdate(
            userUpdateCondition,
            updatedUser,
            { new: true }
        )

        if (!updatedUser)
            return res.status(401).json({
                success: false,
                message: 'không tồn tại người dùng'
            })

        res.json({
            success: true,
            message: 'Thành công!',
            user: updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'User server error' })
    }
})

router.post('/updateInformation', async (req, res) => {
    let { username, email, _id } = req.body
    let user = await User.findById(_id)
    if (!user) {
        return res
            .status(400)
            .json({ success: false, message: 'không tồn tại người dùng' })
    }
    try {
        let updatedUser = {
            username: username,
            email: email
        }

        updatedUser = await User.findOneAndUpdate(
            { _id },
            updatedUser,
            { new: true }
        )

        res.json({
            success: true,
            message: 'Thành công!',
            user: updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'User server error' })
    }
})

router.post('/changePass', async (req, res) => {
    let { currentPass, newPass, _id } = req.body
    console.log(req.body)
    const user = await User.findById(_id)
    if (!user) {
        return res
            .status(400)
            .json({ success: false, message: 'không tồn tại người dùng' })
    }

    try {
        const passValid = await argon2.verify(user.password, currentPass)
        if (!passValid) {
            return res
                .status(400)
                .json({ success: false, message: 'Thông tin không chính xác' })
        }
        else {
            newPass = await argon2.hash(newPass)
        }
        let updatedUser = {
            password: newPass
        }

        updatedUser = await User.findOneAndUpdate(
            { _id },
            updatedUser,
            { new: true }
        )

        if (!updatedUser) {
            return res.status(401).json({
                success: false,
                message: 'không tồn tại người dùng'
            })
        }


        res.json({
            success: true,
            message: 'Thành công!',
            user: updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'User server error' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const UserDeleteCondition = { _id: req.params.id }
        const deletedUser = await User.findOneAndDelete(UserDeleteCondition)

        if (!deletedUser)
            return res.status(401).json({
                success: false,
                message: 'Không tồn tại người dùng'
            })

        res.json({ success: true, user: deletedUser })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'user server error' })
    }
})



////////////////////////////////////////////////////////register
router.post('/register', async (req, res) => {
    const { username, password, email, role } = req.body
    if (!username || !password)
        return res.status(400).json({ success: false, message: 'Thiếu thông tin đăng ký' })
    try {
        const user = await User.findOne({ username })
        if (user)
            return res.status(400).json({ success: false, message: 'Tên đã tồn tại' })


        const hashedPassword = await argon2.hash(password)
        const newUser = new User({ username, password: hashedPassword, email, role })
        await newUser.save()

        // Return token
        const accessToken = jwt.sign(
            { userId: newUser._id },
            process.env.ACCESS_TOKEN_SECRET
        )

        res.json({
            success: true,
            message: 'Đăng ký thành công',
            accessToken,
            newUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'server error' })
    }
})

////////////////////////////////////////////////////////Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password)
        return res
            .status(400)
            .json({ success: false, message: 'Thiếu thông tin đăng nhập' })

    try {
        const user = await User.findOne({ username })
        if (!user)
            return res
                .status(400)
                .json({ success: false, message: 'Thông tin đăng nhập không chính xác' })


        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid)
            return res
                .status(400)
                .json({ success: false, message: 'Thông tin đăng nhập không chính xác' })

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET
        )

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            data: user,
            accessToken
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: ' server error login' })
    }
})


module.exports = router