const express = require('express')
const pool = require('../database').pool
const multer = require('multer')
const path = require('path')
const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/category')
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
        // cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 2},
    fileFilter: fileFilter
})

//Admin Add Category
router.post('/admin/category/add', upload.single('categoryImage'), async function (req, res){
    const name = req.body.name
    const categoryImage = req.file.filename

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try{
        const [result, fields] = await conn.query("INSERT INTO category (name, image_url) VALUES(?, ?)", [name, categoryImage])
        conn.commit()
        res.status(201).json({
            message: `Add category ${name} success`
        })
    }catch(err){
        conn.rollback()
        res.status(400).json(err.toString())
    }finally{
        conn.release()
    }
})

//Get Data For Edit Category
router.get('/admin/category/edit/:id', async function (req, res, next){
    const id = req.params.id

    try{
        const [category, fields] = await pool.query("SELECT name FROM category WHERE category_id = ?", [id])
        res.json({
            name: category[0].name,
        })
    }catch(err){
        return next(err)
    }
})

//Admin Edit Category
router.post('/admin/category/edit/:id', upload.single('categoryImage'), async function (req, res){
    const id = req.params.id
    const name = req.body.name
    const categoryImage = req.file.filename

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try{
        const [category, fields1] = await pool.query("SELECT * FROM category WHERE category_id = ?", [id])
        const categories = category[0]

        if(categories.name !== name){
            const [rows, fields2] = await pool.query("SELECT name FROM category WHERE name = ?", [name])
            if(rows.length > 0){
                throw new Error('This category name is already taken')
            }
            const [result1, fields1] = await conn.query("UPDATE category SET name = ?, image_url = ? WHERE category_id = ?", [name, categoryImage, id])
        }

        conn.commit()
        res.status(201).json({
            message: `Edit category ${name} success`
        })
    }catch(err){
        conn.rollback()
        res.status(400).json(err.toString())
    }finally{
        conn.release()
    }
})

//Show Category For Admin
router.get('/admin/category', async function (req, res, next){
    try{
        const [category, fields] = await pool.query("SELECT * FROM category")
        res.json({
            category: category
        })
    }catch(err){
        return next(err)
    }
})

//Show All Category
router.get('/category', async function (req, res, next){
    try{
        const [category, fields] = await pool.query("SELECT * FROM category")
        res.json({
            category: category
        })
    }catch(err){
        return next(err)
    }
})

//Show Product In Category
router.get('/category/:id', async function (req, res, next){
    const id= req.params.id
    try{
        const [category, fields1] = await pool.query("SELECT name FROM category WHERE category_id = ?", [id])
        const [product, fields2] = await pool.query("SELECT * FROM product WHERE category_id = ?", [id])
        res.json({
            category_name: category[0].name,
            product: product
        })
    }catch(err){
        return next(err)
    }
})

exports.router = router