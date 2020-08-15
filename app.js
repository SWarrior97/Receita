const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const path = require('path');


//load config
dotenv.config({path:'./config/config.env'})

//connect to db
connectDB();

const app = express()

//body parser
app.use(express.urlencoded({ extended:false }))
app.use(express.json())

//logging
if(process.env.NODE_ENV === 'development'){
	app.use(morgan('dev'));
}

//Handlebars
app.engine('.hbs',exphbs({defaultLayout:'main',extname:'.hbs'}));
app.set('view engine','.hbs')

//Static folder
app.use(express.static(path.join(__dirname,'public')))

//Routes
app.use('/',require('./routes/index'))
app.use('/shoppingList',require('./routes/shoppingList'))
app.use('/product',require('./routes/product'))

const PORT = process.env.PORT || 3000

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`))