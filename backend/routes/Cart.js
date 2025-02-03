const express = require('express')
const pool = require('../database').pool
const {v4: uuidv4} = require('uuid')
const moment = require('moment')
const router = express.Router()

const stripe = require('stripe')('sk_test_51OdtOoG6vm99Qmve0y9QUkueHI31wXjGqvz2oGrgdH5QedewysQuhjG6LaDrHW1WAOvzuos2kenkhRu2ys0d9xrn000KGqkjCo')
const endpointSecret = "whsec_17afb61c2e43277df1008b60f55894b80e9f0413c311373d51bb07ff9bc4ac06"


//Check Out Cart
router.post('/cart/checkout', async function (req, res){

    const {user, product} = req.body
    const orderId = uuidv4()

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try{
        const line_items = product.map((products) => {
            return{
                price_data:{
                    currency: "thb",
                    product_data: {
                        name: products.name,
                        metadata:{
                            id: products.product_id,
                        }
                    },
                    unit_amount: products.price * 100,
                },
                quantity: products.quantity,
            }
        })
    
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: line_items,
            mode: "payment",
            success_url: `http://localhost:8080/success/${orderId}`,
            cancel_url: `http://localhost:8080/cancel/${orderId}`,
        })

        console.log('session', session)

        const orderData = {
            user_id: user.user_id,
            order_name: user.fullname,
            order_email: user.email,
            order_address: user.address,
            order_phone: user.phone,
            order_date: moment().format('YYYY-MM-DD'),
            order_id: orderId,
            status: session.status,
            session_id: session.id
        }

        let result = await conn.query("INSERT INTO `order` SET ?", orderData)
        const order_id = result[0].insertId
        await product.forEach(item => {
            conn.query("INSERT INTO orderitem (quantity, subtotal, order_id, product_id) VALUES(?, ?, ?, ?)", [item.quantity, (item.price * item.quantity), order_id, item.product_id])
        })

        conn.commit()
        res.status(201).json({
            message: "Success",
            sessionId: session.id,
        })
    }catch(err){
        conn.rollback()
        res.status(400).json(err.toString())
    }finally{
        conn.release()
    }
})

router.get('/order/:id', async function (req, res, next){
    const order_id = req.params.id

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try{
        const [result, fields] = await pool.query("SELECT * FROM `order` WHERE order_id = ?", [order_id])
        const orderResult = result[0]
        res.json({
            order: orderResult
        })
    }catch(err){
        return next(err)
    }
})

router.post('/webhook', express.raw({type: 'application/json'}), async function (req, res){
    //รับ req signature stripe
    const sig = req.headers['stripe-signature']

    let event

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        console.log("Webhook Success")
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
        console.log("Received webhook payload:", req.body)
    } catch (err) {
        console.log(`Webhook Error: ${err.message}`)
        res.status(400).send(`Webhook Error: ${err.message}`)
        return
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const paymentData = event.data.object
        console.log('paymentData', paymentData)

        //update status กลับเข้าไปใน database
        const session_id = paymentData.id
        const data = {
            status: paymentData.status
        }
        try{
            const [result] = await conn.query("UPDATE `order` SET ? WHERE session_id = ?", [data, session_id])
            const [order] = await pool.query("SELECT id FROM `order` WHERE session_id = ?", [session_id])
            const [orderitem] = await pool.query("SELECT quantity, product_id FROM orderitem WHERE order_id = ?", [order[0].id])
            if(paymentData.status === 'complete'){
                await orderitem.forEach(item => {
                    conn.query("UPDATE product SET quantity = quantity - ? WHERE product_id = ?", [item.quantity, item.product_id])
                })
            }
            console.log("== update result", result)
            conn.commit()
            res.status(201).json({
                message: "Update Status Success"
            })
        }catch(err){
            conn.rollback()
            res.status(400).json({
                message: "Update Status Fail"
            })
        }finally{
            conn.release()
        }

        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.send()
})
//order_id in route cancel = uuid V4
router.delete('/cancel/:order_id', async function (req, res){
    const uuid = req.params.order_id

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try{
        const [result] = await pool.query("SELECT id FROM `order` WHERE order_id = ?",[uuid])
        await conn.query("DELETE FROM orderitem WHERE order_id = ?",[result[0].id])
        await conn.query("DELETE FROM `order` WHERE order_id = ?",[uuid])
        conn.commit()
        res.status(201).json({
            message: "Delete Success"
        })
    }catch(err){
        conn.rollback()
        res.status(400).json({
            message: "Delete Fail"
        })
    }finally{
        conn.release()
    }
})

exports.router = router