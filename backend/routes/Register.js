const express = require('express')
const pool = require('../database').pool
const bcrypt = require('bcrypt')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const router = express.Router()

const passwordValidator = (value, helpers) => {
    if (value.length < 8) {
        throw new Joi.ValidationError('Password must contain at least 8 characters')
    }
    if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
        throw new Joi.ValidationError('Password must be harder')
    }
    return value
}

const emailValidator = async (value, helpers) =>{
    const [rows, fields] = await pool.query(
        "SELECT email FROM users WHERE email = ?", 
        [value]
    )
    if (rows.length > 0) {
        const message = 'This email is already taken'
        throw new Joi.ValidationError(message, { message })
    }
    return value
}

const signupSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().external(emailValidator).required().email(),
    password: Joi.string().custom(passwordValidator).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required(),
})

const adminSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().external(emailValidator).required().email(),
    password: Joi.string().custom(passwordValidator).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required(),
})

const signinSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
})

router.get('/user', async function (req, res){
    try{
        const authHeader = req.headers['authorization']
        let authToken = ''
        if(authHeader){
            authToken = authHeader.split(' ')[1]
        }

        const user = jwt.verify(authToken, "secret")

        const [check] = await pool.query("SELECT * FROM users WHERE user_id = ?", [user.user_id])

        if(!check[0]){
            throw new Error("User Not Found")
        }

        const [results] = await pool.query("SELECT * FROM users WHERE user_id = ?", [user.user_id])
        res.json({
            users: results[0]
        })
    }catch(err){
        res.status(401).json(err.toString())
    }
})

router.post('/signup', async function (req, res){
    try{
        await signupSchema.validateAsync(req.body, {abortEarly: false})
    }catch(err){
        return res.status(400).json(err.toString())
    }

    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const email = req.body.email
    const password = await bcrypt.hash(req.body.password, 10)

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try{
        await conn.query("INSERT INTO users (first_name, last_name, email, password) VALUES(?, ?, ?, ?)",
        [first_name, last_name, email, password])
        conn.commit()
        res.status(201).json({
            message: "Signup Success"
        })
    }catch(err){
        conn.rollback()
        res.status(400).json(err.toString())
    }finally{
        conn.release()
    }
})

router.post('/signin', async function (req, res){
    try{
        await signinSchema.validateAsync(req.body, {abortEarly: false})
    }catch(err){
        return res.status(400).json(err.toString())
    }

    const email = req.body.email
    const password = req.body.password

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try{
        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email])
        const user = users[0]

        if(!user){
            throw new Error('Incorrect username or password')
        }

        if(!(await bcrypt.compare(password, user.password))){
            throw new Error('Incorrect username or password')
        }

        const token =  jwt.sign({user_id: user.user_id}, "secret", {expiresIn: '2h'})
        conn.commit()
        res.status(200).json({
            message: "Signin Success",
            token: token
        })
    }catch(err){
        conn.rollback()
        res.status(401).json(err.toString())
    }finally{
        conn.release()
    }
})

router.post('/manage/add/admin', async function(req, res){
    try{
        await adminSchema.validateAsync(req.body, {abortEarly: false})
    }catch(err){
        return res.status(400).json(err.toString())
    }

    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const email = req.body.email
    const password = await bcrypt.hash(req.body.password, 10)
    const role = 'admin'

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try{
        await conn.query("INSERT INTO users (first_name, last_name, email, password, role) VALUES(?, ?, ?, ?, ?)",
        [first_name, last_name, email, password, role])
        conn.commit()
        res.status(200).json({
            message: "Add New Admin Success"
        })
    }catch(err){
        conn.rollback()
        res.status(400).json(err.toString())
    }finally{
        conn.release()
    }
})

exports.router = router