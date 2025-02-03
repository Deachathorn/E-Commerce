const express = require('express')
const pool = require('../database').pool
const router = express.Router()

router.get('/manage/admin', async function(req, res, next){
    try{
        const [admin] = await pool.query("SELECT user_id, first_name, last_name, email, role FROM users WHERE role = 'admin'")
        res.json({
            admin: admin
        })
    }catch(err){
        return next(err)
    }
})

router.put('/manage/update/admin/:id', async function(req, res){
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const email = req.body.email

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try{
        await conn.query("UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE user_id = ?",
        [first_name, last_name, email, req.params.id])
        conn.commit()
        res.status(201).json({
            message: `Update Admin id ${req.params.id} Success`,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        })
    }catch(err){
        conn.rollback()
        res.status(400).json(err.toString())
    }finally{
        conn.release()
    }
})

router.delete('/manage/delete/admin/:id', async function(req, res){
    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try{
        const [result] = await pool.query("SELECT first_name, last_name, role FROM users WHERE user_id = ?", [req.params.id])
        if(!result[0]){
            res.status(404).json({
                message: "Use not found"
            })
        }
        if(result[0]){
            res.status(201).json({
                message: `Delete ${result[0].role} ${result[0].first_name} ${result[0].last_name} success`
            })
            await conn.query("DELETE FROM users WHERE user_id = ?", [req.params.id])
        }
        conn.commit()
    }catch(err){
        conn.rollback()
        res.status(400).json(err.toString())
    }finally{
        conn.release()
    }
})

router.get('/manage/order', async function(req, res, next){
    try{
        const [get_order] = await pool.query("SELECT id, order_name, order_email, order_address, order_phone, order_date, status FROM `order`")
        res.status(200).json({
            order: get_order
        })
    }catch(err){
        return next(err)
    }
})

exports.router = router