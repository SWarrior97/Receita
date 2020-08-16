const express = require('express')
const router = express.Router()
const ShoppingList = require('../models/shoppingList')
const Product = require('../models/Product')
var path = require("path");
var mongoose = require('mongoose');
const { ObjectId } = require('mongodb')


// @desc show add stories /stories/add
// @route GET /
router.get('/add',(req,res) =>{
	res.render('ShoppingList/add')
})

router.get('/product/add/:id',async (req,res) =>{
	const products = await Product.find().lean()
	let shoppingList =  await ShoppingList.findById(req.params.id).lean()
	res.render('ShoppingList/addProduct',{
		shoppingList,
		products
	})
})

router.post('/product/add/:id',async (req,res) =>{
	try{
		let shoppingList =  await ShoppingList.findById(req.params.id).lean()

		if (!shoppingList) {
			return res.render('error/404')
		}
		var _id =req.body.product;
		let product =  await Product.findOne({id:_id}).lean()
		
		product.quantity = req.body.quantity;

		req.body.name = shoppingList.name;

		let price = req.body.quantity * product.price
		
		req.body.totalPrice = shoppingList.totalPrice + price;
		
		req.body.products = [];

		shoppingList.products.forEach(function(p){
			req.body.products.push(p);
		});

		req.body.products.push(product);

		shoppingList = await ShoppingList.findOneAndUpdate({ _id: req.params.id }, req.body, {
			new: true,
			runValidators: true,
		  })

		product = await Product.findOneAndUpdate({ id: _id }, product, {
			new: true,
			runValidators: true,
		  })
		
		  let url = '/shoppingList/details/'+shoppingList._id;
		  
		res.redirect(url)

	}catch(err){
		console.log(err)
		res.render('error/500')
	}
})

router.post('/',async (req,res) =>{
	try{
		await ShoppingList.create(req.body)
		res.redirect('/')
	}catch(err){
		console.log(err)
		res.render('error/500')
	}
})

router.get('/details/:id',async(req,res) =>{
	let shoppingList =  await ShoppingList.findById(req.params.id).lean()

    res.render('ShoppingList/details',{
        shoppingList
    })
})

module.exports = router
