const express = require('express')
const pool = require('../database').pool
const router = express.Router()

//Show Home Page
router.get('/', async function(req, res, next){
    try{
        const [category] = await pool.query("SELECT * FROM category LIMIT 3")
        const [product] = await pool.query("SELECT product_id, name, description, price, file_path FROM product LIMIT 3")
        res.json({
            categories: category,
            products: product
        })
    }catch(err){
        return next(err)
    }
})

exports.router = router