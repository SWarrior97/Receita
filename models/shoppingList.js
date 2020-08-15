const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const ShoppingListSchema = new mongoose.Schema({
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
        default:[]
      },
    totalPrice:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model('ShoppingList', ShoppingListSchema)
