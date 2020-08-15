const express = require('express')
const router = express.Router()
const Recipe = require('../models/Recipe')
const Product = require('../models/Product')
var path = require("path");


// @desc   
// @route   GET /
router.get('/',async (req,res) =>{
	try{
		const recipes = await Recipe.find().lean()

		res.render('recipes/index',{
            recipes
        })

	}catch(err){
		console.log(err)
		res.render('error/500')
	}
})

router.get('/add',async(req,res) =>{
    const products = await Product.find().lean()
	res.render('recipes/add',{
        products
    })
})

router.get('/details/:id',async(req,res) =>{
    let recipe =  await Recipe.findById(req.params.id).lean()
    console.log(recipe)

    res.render('recipes/details',{
        recipe
    })
})

router.post('/',async (req,res) =>{
	try{
        var splitted = req.body.ingredients2.split(';');
        req.body.ingredients = [];
        req.body.products = [];

        for(let i=0;i<splitted.length-1;i++){
            var aux = splitted[i].split('->');
            req.body.ingredients.push({name:aux[1],quantity:aux[2]});
            req.body.products.push({name:aux[1],id:aux[0]})
        }
        
		await Recipe.create(req.body)
		res.redirect('/recipes')
	}catch(err){
		console.log(err)
		res.render('error/500')
	}
})


module.exports = router
