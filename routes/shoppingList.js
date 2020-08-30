const express = require('express')
const router = express.Router()
const ShoppingList = require('../models/shoppingList')
const Product = require('../models/Product')
var path = require("path");
var mongoose = require('mongoose');
const { ObjectId } = require('mongodb')
var multer  = require('multer')
var upload = multer()


// @desc show add stories /stories/add
// @route GET /
router.get('/add',(req,res) =>{
	res.render('ShoppingList/add')
})

router.delete('/remove/:id', async (req, res) => {
	try {
	  let shoppingList = await ShoppingList.findById(req.params.id).lean()
  
	  if (!shoppingList) {
		return res.render('error/404')
	  }
  
		await ShoppingList.remove({ _id: req.params.id })
		  
		res.redirect('/')
	} catch (err) {
	  console.error(err)
	  return res.render('error/500')
	}
  })

router.get('/product/add/:id',async (req,res) =>{
	const products = await Product.find().lean()
	let shoppingList =  await ShoppingList.findById(req.params.id).lean()
	res.render('ShoppingList/addProduct',{
		shoppingList,
		products
	})
})

router.put('/product/remove/:id',async (req,res) =>{
	try{
		let shoppingList =  await ShoppingList.findById(req.params.id).lean()

		let product =  await Product.findOne({_id:req.body.product}).lean()

		let prodAux = [];

		shoppingList.products.forEach(function(p){
			if(p.id !== product.id){
				prodAux.push(p)
			}
		});

		

		shoppingList.products = prodAux;

		let price = 0;

		shoppingList.products.forEach(function(p){
			if(p.quantity.toLowerCase().includes('kg')){
				let auxQuantity = parseFloat(p.quantity.toLowerCase().split('k')[0]);

				price = price + auxQuantity * p.price;
			}else{
				price = price + p.quantity * p.price;
			}
		});

		shoppingList.totalPrice = price;

		shoppingList = await ShoppingList.findOneAndUpdate({ _id: req.params.id }, shoppingList, {
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

router.put('/product/add/:id',async (req,res) =>{
	try{
		let shoppingList =  await ShoppingList.findById(req.params.id).lean()

		if (!shoppingList) {
			return res.render('error/404')
		}
		var _id =req.body.product;
		let product =  await Product.findOne({id:_id}).lean()

		if(req.body.quantity.toLowerCase().includes('kg')){
			req.body.quantity = req.body.quantity.toLowerCase();
		}
		
		product.quantity = req.body.quantity;

		req.body.name = shoppingList.name;

		let quantityWithoutUnity = req.body.quantity.split('k')[0];
		let price = 0;

		if(req.body.quantity.toLowerCase().includes('kg')){
			let priceFloat = parseFloat(quantityWithoutUnity)
			price = priceFloat * product.price ;
		}else{
			price = req.body.quantity * product.price
		}

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

router.post('/',upload.none(),async (req,res) =>{
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

router.get('/edit/:id',async(req,res) =>{
    const shoppingList =  await ShoppingList.findById(req.params.id).lean()


    res.render('ShoppingList/edit',{
		shoppingList
    })
})

router.put('/:id',async (req,res) =>{
	let shoppingList =  await ShoppingList.findById(req.params.id).lean()

    try{

		if (!shoppingList) {
			return res.render('error/404')
		}

		shoppingList = await ShoppingList.findOneAndUpdate({ _id: req.params.id }, req.body, {
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

module.exports = router
