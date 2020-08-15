const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
var path = require("path");


// @desc show add stories /stories/add
// @route GET /
router.get('/',async(req,res) =>{
    try{
		const products = await Product.find().lean()
		res.render('product/index',{
            products
        })
	}catch(err){
		console.log(err)
		res.render('error/500')
	}
	
})

router.get('/add',(req,res) =>{
	res.render('product/add')
})

router.post('/',async (req,res) =>{
	try{
		await Product.create(req.body)
		res.redirect('/product')
	}catch(err){
		console.log(err)
		res.render('error/500')
	}
})

module.exports = router
