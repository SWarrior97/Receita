const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const ShoppingList = require('../models/shoppingList')
const Category = require('../models/Category')
var path = require("path");
var multer  = require('multer')
var upload = multer()


// @desc show add stories /stories/add
// @route GET /
router.get('/',async(req,res) =>{
    try{
		const categories = await Category.find().lean()
		res.render('category/index',{
            categories
        })
	}catch(err){
		console.log(err)
		res.render('error/500')
	}
	
})

router.get('/add',(req,res) =>{
	res.render('category/add')
})

router.post('/',upload.none(),async (req,res) =>{
	try{
		await Category.create(req.body)
		res.redirect('/category')
	}catch(err){
		console.log(err)
		res.render('error/500')
	}
})

router.delete('/remove/:id', async (req, res) => {
	try {
      let category = await Category.findById(req.params.id).lean()
      const products = await Product.find().lean()

      var aux = "";

     products.forEach(function(p){
        if(p.categoryName == category.name){
            aux = null
        }
      })
      
      if(aux == null){
        return res.render('error/custom',{
            title:"Category",
            content:"Category cannot be remove because there are product with that category"
            })
      }
  
	  if (!category) {
		return res.render('error/404')
	  }
  
		await Category.remove({ _id: req.params.id })
		  
		res.redirect('/category')
	} catch (err) {
	  console.error(err)
	  return res.render('error/500')
	}
})

router.get('/edit/:id',async(req,res) =>{
    const category =  await Category.findById(req.params.id).lean()


    res.render('category/edit',{
		category
    })
})

router.put('/:id',async (req,res) =>{
	let category =  await Category.findById(req.params.id).lean()
    console.log("asdasd")
    try{

		if (!category) {
			return res.render('error/404')
		}

		category = await Category.findOneAndUpdate({ _id: req.params.id }, req.body, {
			new: true,
			runValidators: true,
        })
        
		res.redirect('/category')
	}catch(err){
		console.log(err)
		res.render('error/500')
	}
})

module.exports = router
