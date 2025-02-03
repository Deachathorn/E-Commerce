const express = require('express')
const cors = require('cors')
const app = express()

app.use((req, res, next) => {
    if (req.originalUrl === "/webhook") {
        next()
    } else {
        express.json()(req, res, next)
    }
})

app.use(cors())
app.use('/uploads', express.static('uploads'))
app.use(express.urlencoded({ extended: false }))

const products = require('./routes/Product')
const category = require('./routes/Category')
const home = require('./routes/Home')
const cart = require('./routes/Cart')
const register = require('./routes/Register')
const comment = require('./routes/Comment')
const profile = require('./routes/Profile')
const manage = require('./routes/Manage')
const reset_password = require('./routes/Reset_password')

app.use(products.router)
app.use(category.router)
app.use(home.router)
app.use(cart.router)
app.use(register.router)
app.use(comment.router)
app.use(profile.router)
app.use(manage.router)
app.use(reset_password.router)

app.listen(3000, () => console.log("Server is running..."))