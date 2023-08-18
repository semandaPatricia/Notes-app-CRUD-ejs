require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require("method-override");
const mongoose = require('mongoose')
const connectDB = require('./server/config/db');

const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();
const port = 5000 || process.env.PORT;

// Connect to Database
connectDB(); 


// Static Files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));


// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)
//passport config
app.use(passport.initialize());
app.use(passport.session());



// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


//simple route
app.use('./',(req,res) =>{
   const locals = {
    title: 'notes app nodejs',
    description:'node js notes app with ejs rendering'
   }
   res.render('index',locals)
})

//Routes
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));

// Handle 404
app.get('*', function(req, res) {
  //res.status(404).send('404 Page Not Found.')
  res.status(404).render('404');
})


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});