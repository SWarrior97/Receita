const express = require('express')
const router = express.Router()
const Recipe = require('../models/Recipe')
const Product = require('../models/Product')
var path = require("path");
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


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

    let auxiliar = '';

    recipe.ingredients.forEach(async function(record){
        auxiliar = auxiliar + record.quantity +" "+record.name +"\n";
    })

    res.render('recipes/details',{
        recipe,
        auxiliar
    })
})

router.post('/', upload.single('file'),async (req,res) =>{
	try{
        console.log(req.file)
        req.body.image = req.file.path
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


router.delete('/remove/:id', async (req, res) => {
	try {
	  let recipe = await Recipe.findById(req.params.id).lean()
  
	  if (!recipe) {
		return res.render('error/404')
	  }
  
		await Recipe.remove({ _id: req.params.id })
		  
		res.redirect('/recipes')
	} catch (err) {
	  console.error(err)
	  return res.render('error/500')
	}
})

router.get('/edit/:id',async(req,res) =>{
    const recipe =  await Recipe.findById(req.params.id).lean()
    const products = await Product.find().lean()

    let auxiliar = '';

    for(let i=0;i<recipe.ingredients.length;i++){
        auxiliar = auxiliar + recipe.products[i].id +"->"+recipe.products[i].name+"->"+recipe.ingredients[i].quantity+";";
    }

    res.render('recipes/edit',{
        recipe,
        products,
        auxiliar
    })
})

router.put('/:id',async (req,res) =>{
    let recipe =  await Recipe.findById(req.params.id).lean()

    try{
        var splitted = req.body.ingredients2.split(';');
        req.body.ingredients = [];
        req.body.products = [];

        for(let i=0;i<splitted.length-1;i++){
            var aux = splitted[i].split('->');
            req.body.ingredients.push({name:aux[1],quantity:aux[2]});
            req.body.products.push({name:aux[1],id:aux[0]})
        }
        
		recipe = await Recipe.findOneAndUpdate({ _id: req.params.id }, req.body, {
			new: true,
			runValidators: true,
        })
        
		res.redirect('/recipes')
	}catch(err){
		console.log(err)
		res.render('error/500')
	}
})

module.exports = router
