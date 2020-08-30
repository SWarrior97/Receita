const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const path = require('path')
const methodOverride = require('method-override')
var ip = require("ip")



//load config
dotenv.config({path:'./config/config.env'})

//connect to db
connectDB();

const app = express()

//body parser
app.use(express.urlencoded({ extended:false }))
app.use(express.json())

// Method override
app.use(
	methodOverride(function (req, res) {
	  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		// look in urlencoded POST bodies and delete it
		let method = req.body._method
		delete req.body._method
		return method
	  }
	})
  )

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
app.use('/recipes',require('./routes/recipes'))

const PORT = process.env.PORT || 3000
const HOSTNAME = ip.address();


app.listen(PORT,HOSTNAME,console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT} Hostname ${HOSTNAME}`))