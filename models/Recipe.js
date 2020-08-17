const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const RecipeSchema = new mongoose.Schema({
    id:{
        type:String,
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
    ingredients:{
        type:Array,
        default:[],
        required:true
    },
    image:{
        type:String,
        default:''
    }

})

module.exports = mongoose.model('Recipe', RecipeSchema)
