const express = require('express')
const pool = require('../database').pool
const multer = require('multer')
const path = require('path')
const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/profile')
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

router.post('/profile/:id', upload.single('picture'), async function (req, res){
    const id = req.params.id
    const picture = req.file.filename

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try{
        await conn.query("UPDATE users SET file_path = ? WHERE user_id = ?", [picture, id])
        conn.commit()
        res.status(200).json({
            path: picture,
            message: "Upload Picture Success"
        })
    }catch(err){
        conn.rollback()
        res.status(400).json(err.toString())
    }finally{
        conn.release()
    }
})

exports.router = router