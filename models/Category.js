const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const CategorySchema = new mongoose.Schema({
    id:{
        type:String,
        default:uuidv4()
    },
    name:{
        type:String,
        required:true
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }]
})

module.exports = mongoose.model('Category', CategorySchema)
