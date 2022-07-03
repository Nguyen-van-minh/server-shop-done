const express = require('express')
const userRouter = require('./route/userRoute');
const categoryRouter = require('./route/categoryRoute')
const productRouter = require('./route/productRoute')
const orderRoute = require('./route/orderRoute')
const images = require('./route/images')
const sliderRouter = require('./route/sliderRoute')
const cartRouter = require('./route/cartRoute')
const information = require('./route/informationRoute')
const review = require('./route/reviewRoute')
const vnpay = require('./route/vnpayRoute')
const mg = require('mailgun-js');
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()





const app = express();
app.use(express.json())
app.use(cors())

const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://admin:Minh30-08-2001@first.poozr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )

        console.log('MongoDB connected')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

connectDB()


app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/product', productRouter)
app.use('/api/image', images)
app.use('/api/slider', sliderRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRoute)
app.use('/api/information', information)
app.use('/api/review', review)
app.use('/api/vnpay', vnpay)

const mailgun = () =>
    mg({
        apiKey: "87b64c51e8bde708a076e6c45cd728c5-77985560-68872229",
        domain: "sandbox40086c5ab4a2464fb48f38313ad5a9f2.mailgun.org",
    });

app.post('/api/email', (req, res) => {
    const { email, subject, message } = req.body;
    console.log(req.body)
    mailgun()
        .messages()
        .send(
            {
                from: "Beautiful <beautiful@mg.yourdomain.com>",
                to: `${email}`,
                subject: `${subject}`,
                text: `${message}`,
            },
            (error, body) => {
                if (error) {
                    console.log(error);
                    res.status(500).send({ message: 'Error in sending email' });
                } else {
                    console.log(body);
                    res.send({ message: 'Email sent successfully' });
                }
            }
        );
});


// const PORT = process.env.PORT || 5000
const PORT = 5000
app.listen(PORT, () => console.log(`Server runing on port ${PORT}`))