const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const ShoppingList = require('../models/shoppingList')
var path = require("path");
var multer  = require('multer')
var upload = multer()


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

router.post('/', upload.none(),async (req,res) =>{
	try{
		await Product.create(req.body)
		res.redirect('/product')
	}catch(err){
		console.log(err)
		res.render('error/500')
	}
})

router.delete('/remove/:id', async (req, res) => {
	try {
	  let product = await Product.findById(req.params.id).lean()
  
	  if (!product) {
		return res.render('error/404')
	  }
  
		await Product.remove({ _id: req.params.id })
		  
		res.redirect('/product')
	} catch (err) {
	  console.error(err)
	  return res.render('error/500')
	}
})

router.get('/edit/:id',async(req,res) =>{
    const product =  await Product.findById(req.params.id).lean()


    res.render('product/edit',{
		product
    })
})


router.put('/:id',async (req,res) =>{
	let product =  await Product.findById(req.params.id).lean()
	const shoppingList = await ShoppingList.find().lean()

    try{

		if (!product) {
			return res.render('error/404')
		}

		if(product.price != req.body.price){
			shoppingList.forEach(function(record){
				record.products.forEach(function(p){
					if(p.id == product.id){
						p.price = product.price;
					}
				});
			});

			//update total price
			let totalPrice = 0;
			shoppingList.forEach(function(record){
				record.products.forEach(function(p){
					let price = p.prrice * p.quantity;
					totalPrice = totalPrice + price;
				});

				record.totalPrice = totalPrice;
				totalPrice = 0;
			});
		}
		
		product = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, {
			new: true,
			runValidators: true,
        })
        
		res.redirect('/product')
	}catch(err){
		console.log(err)
		res.render('error/500')
	}
})

module.exports = router
