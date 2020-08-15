const express = require('express')
const router = express.Router()
const ShoppingList = require('../models/shoppingList')
var path = require("path");


// @desc   
// @route   GET /
router.get('/',async (req,res) =>{
	try{
		const shoppingLists = await ShoppingList.find().lean()

		res.render('dashboard',{
      layout:'main.hbs',
      shoppingLists
    })

	}catch(err){
		console.log(err)
		res.render('error/500')
	}
})


module.exports = router
