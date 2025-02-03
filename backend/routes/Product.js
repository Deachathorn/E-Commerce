const express = require('express')
const pool = require('../database').pool
const multer = require('multer')
const path = require('path')
const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/product')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    },
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        cb(new Error('Invalid file type'))
    }
}

const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 2},
    fileFilter: fileFilter
})

//Admin Add Product
router.post('/admin/product/add', upload.single('productImage'), async function (req, res){
    const name = req.body.name
    const description = req.body.description
    const price = req.body.price
    const quantity = req.body.quantity
    const productImage = req.file.filename
    const category = req.body.category

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try{
        await conn.query("INSERT INTO product (name, description, price, quantity, file_path, category_id) VALUES(?, ?, ?, ?, ?, ?)",
        [name, description, price, quantity, productImage, category])
        conn.commit()
        res.status(201).json({
            message: `Add new product ${name} success`
        })
    }catch(err){
        conn.rollback()
        res.status(400).json(err.toString())
    }finally{
        conn.release()
    }
})

//Get Data Of Product To Edit
router.get('/admin/product/edit/:id', async function(req, res, next){
    const id = req.params.id

    try{
        const [product] = await pool.query("SELECT name, description, price, quantity, category_id FROM product WHERE product_id = ?", [id])
        const [category] = await pool.query("SELECT name FROM category WHERE category_id = ?", [product[0].category_id])
        const [categories] = await pool.query("SELECT category_id, name FROM category")
        res.json({
            name: product[0].name,
            description: product[0].description,
            price: product[0].price,
            quantity: product[0].quantity,
            category_name: category[0].name,
            categories: categories
        })
    }catch(err){
        return next(err)
    }
})

//Admin Edit Product
router.post('/admin/product/edit/:id', upload.single('productImage'), async function (req, res){
    const id = req.params.id
    const name = req.body.name
    const description = req.body.description
    const price = req.body.price
    const quantity = req.body.quantity
    const productImage = req.file
    const category = req.body.category

    const conn = await pool.getConnection()
    await conn.beginTransaction()
    try{
        const [result] = await pool.query("SELECT category_id FROM category WHERE name = ?", [category])
        const category_id = result[0].category_id

        if(productImage){
            await conn.query("UPDATE product SET file_path = ? WHERE product_id = ?", [req.file.filename, id])
        }

        await conn.query("UPDATE product SET name = ?, description = ?, price = ?, quantity = ?, category_id = ? WHERE product_id = ?", 
        [name, description, price, quantity, category_id, id])

        conn.commit()
        res.status(201).json({
            message: `Edit product ${name} success`
        })
    }catch(err){
        conn.rollback()
        res.status(400).json(err.toString())
    }finally{
        conn.release()
    }
})

//Show All Product To Admin
router.get('/admin/product', async function (req, res, next){

    try{
        const [product] = await pool.query("SELECT product_id, name, price, file_path FROM product")
        res.json({
            product: product
        })
    }catch(err){
        return next(err)
    }
})

//Product Details
router.get('/product/:id', async function (req, res, next){
    const id = req.params.id
    try{
        const [product] = await pool.query("SELECT * FROM product WHERE product_id = ?", [id])
        const [category] = await pool.query("SELECT name FROM category WHERE category_id = ?", [product[0].category_id])
        res.json({
            id: product[0].product_id,
            name: product[0].name,
            description: product[0].description,
            price: product[0].price,
            quantity: product[0].quantity,
            file_path: product[0].file_path,
            category_name: category[0].name
        })
    }catch(err){
        return next(err)
    }
})

router.get('/product', async function (req, res, next) {
    try{
        const [product, fields1] = await pool.query("SELECT product_id, name, price, file_path FROM product")
        res.json({
            product: product
        })
    }catch(err){
        return next(err)
    }
})

exports.router = router