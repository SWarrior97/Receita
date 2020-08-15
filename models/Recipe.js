const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const RecipeSchema = new mongoose.Schema({
    id:{
        type:Number,
        default:uuidv4()
    },
    name:{
        type:String,
        required:true
    },
    products:{
        type:Array,
        require:true
    },
    
    preparation:{
        type:String,
        required:true
    },
})

module.exports = mongoose.model('Recipe', RecipeSchema)
