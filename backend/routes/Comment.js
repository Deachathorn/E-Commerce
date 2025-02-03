const express = require('express')
const pool = require('../database').pool
const router = express.Router()

router.post('/product/:product_id/comment', async function (req, res){
    const rating = req.body.rating
    const comment = req.body.comment
    const user_id = req.body.user_id
    const product_id = req.params.product_id

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try{
        const [result, fields] = await conn.query("INSERT INTO review (rating, comment, user_id, product_id) VALUES(?, ?, ?, ?)", [rating, comment, user_id, product_id])

        conn.commit()
        res.status(201).json({
            message: "Comment has been posted"
        })
    }catch(err){
        conn.rollback()
        res.status(400).json({
            message: "Can Not Comment"
        })
    }finally{
        conn.release()
    }
})

router.get('/:product_id/comment', async function (req, res, next){
    const product_id = req.params.product_id
    try{
        const [comment, fields] = await pool.query("SELECT review.user_id, rating, comment, file_path FROM review INNER JOIN users ON review.user_id = users.user_id WHERE product_id = ?", [product_id])
        res.json({
            comment: comment
        })
    }catch(err){
        return next(err)
    }
})

router.get('/:product_id/rating', async function (req, res, next){
    const product_id = req.params.product_id
    try{
        const [rating1, fields1] = await pool.query("SELECT rating FROM review WHERE product_id = ? AND rating = 1", [product_id])
        const [rating2, fields2] = await pool.query("SELECT rating FROM review WHERE product_id = ? AND rating = 2", [product_id])
        const [rating3, fields3] = await pool.query("SELECT rating FROM review WHERE product_id = ? AND rating = 3", [product_id])
        const [rating4, fields4] = await pool.query("SELECT rating FROM review WHERE product_id = ? AND rating = 4", [product_id])
        const [rating5, fields5] = await pool.query("SELECT rating FROM review WHERE product_id = ? AND rating = 5", [product_id])
        res.json({
            rating1: rating1,
            rating2: rating2,
            rating3: rating3,
            rating4: rating4,
            rating5: rating5
        })
    }catch(err){
        return next(err)
    }
})

exports.router = router