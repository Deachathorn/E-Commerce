const express = require('express')
const pool = require('../database').pool
const bcrypt = require('bcrypt')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const router = express.Router()

const JWT_SECRET = 'super secret...'

const passwordValidator = (value, helpers) => {
    if (value.length < 8) {
        throw new Joi.ValidationError('Password must contain at least 8 characters')
    }
    if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
        throw new Joi.ValidationError('Password must be harder')
    }
    return value
}

const emailSchema = Joi.object({
    email: Joi.string().required().email()
})

const resetSchema = Joi.object({
    password: Joi.string().custom(passwordValidator).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required(),
})

router.post('/forgot-password', async function(req, res){
    try{
        await emailSchema.validateAsync(req.body, {abortEarly: false})
    }catch(err){
        return res.status(400).json(err.toString())
    }

    const email = req.body.email

    try{
        const [check] = await pool.query("SELECT user_id, email, password FROM users WHERE email = ?", [email])
        if(!check[0]){
            return res.status(404).json({
                message: "user not found"
            })
        }

        const user_id = check[0].user_id
        const secret = JWT_SECRET + check[0].password
        const reset_token = jwt.sign({user_id: user_id}, secret, {expiresIn: '15m'})
        const link = `http://localhost:8080/reset-password/${user_id}/${reset_token}`
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'noti.dhss@gmail.com',
                pass: 'ghjm cspi qhgw ghyu'
            }
        })

        const option = {
            from: 'noti.dhss@gmail.com',
            to: check[0].email,
            subject: 'Link To Reset Your Password',
            html: `
                <p>Change Your Password <a href="${link}">here</a></p>
            `
        }

        await transporter.sendMail(option)
        res.status(200).json({
            message: "Send mail success"
        })
    }catch(err){
        res.status(400).json({
            message: "Can't send mail"
        })
    }
})

router.post('/reset-password/:user_id/:reset_token', async function(req, res){
    try{
        await resetSchema.validateAsync(req.body, {abortEarly: false})
    }catch(err){
        return res.status(400).json(err.toString())
    }

    const user_id = req.params.user_id
    const reset_token = req.params.reset_token
    const password = await bcrypt.hash(req.body.password, 10)

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try{
        const [check] = await pool.query("SELECT user_id, password FROM users WHERE user_id = ?", [user_id])
        if(!check[0]){
            return res.status(404).json({
                message: "User not found"
            })
        }

        const secret = JWT_SECRET + check[0].password
        const user = jwt.verify(reset_token, secret)

        await conn.query("UPDATE users SET password = ? WHERE user_id = ?", [password, user.user_id])
        conn.commit()
        res.status(201).json({
            message: "Change password success"
        })
    }catch(err){
        conn.rollback()
        res.status(400).json({
            message: "Change password fail"
        })
    }finally{
        conn.release()
    }
})

exports.router = router