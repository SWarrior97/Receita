const express = require('express')
const router = express.Router()
const ShoppingList = require('../models/shoppingList')
var path = require("path");


// @desc show add stories /stories/add
// @route GET /
router.get('/add',(req,res) =>{
	res.render('ShoppingList/add')
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

module.exports = router
