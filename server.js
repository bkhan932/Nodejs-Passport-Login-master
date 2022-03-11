if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
var router = express.Router();
var models= require('./models')
var path = require("path")
var exphbs = require('express-handlebars');

const viewpath= path.join(__dirname,"/views/pages")
const ejs = require('ejs');

//---------------------------------------------------------------------------------------
//Facebook Login
const FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config/fbconfig')
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
    callbackURL: config.facebookAuth.callbackURL
  }, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

//---------------------------------------------------------------------------------------

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

app.use('/img/', express.static('./img'));
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))




const {indexView, loginView, orderView, deleteView, updateView, registerView} = require('./controllers/controller.js');




app.get('/', indexView,  passport.authenticate('local',  {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/login',checkNotAuthenticated, loginView);


app.post('/login', checkNotAuthenticated, passport.authenticate('local',  {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


app.get('/register', checkNotAuthenticated, registerView);

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      var insertionData = await models.register.create({ 
      name: req.body.name, 
      email: req.body.email,
      password:hashedPassword,
    })
 
    res.redirect('/login')

  } catch (ex) {
    let error = 'Email already exists';
    res.render('register.ejs', {error});
  }
});


app.get('/orders', orderView, passport.authenticate('local',  {
  successRedirect: '/orders',
  failureRedirect: '/login',
  failureFlash: true
}));


app.post('/orders',  async (req, res) => {

  try{
    var insertOrder= await models.orders.create({

      orderName:req.body.orderName,
      customerName:req.body.customerName,
      orderNumber:req.body.orderNumber,

    });
    // res.json(insertOrder);
  }
  catch(ex){

    res.render('orders/index.ejs', ex)

  }
  res.json('Data added sucessfully');
})



// delete orders
app.get('/delete', deleteView, passport.authenticate('local',  {
  successRedirect: '/delete',
  failureRedirect: '/login',
  failureFlash: true
}));



app.post('/delete', async(req, res)=>{

  try{
  var deletionData= await models.orders.destroy({ 
    where:{
      orderNumber: req.body.orderNumber
    }
  });

 } catch(ex){
  res.render('orders/delete.ejs', ex)
  }
  res.json('deleted successfully');
})



app.get('/update',updateView, passport.authenticate('local',  {
  successRedirect: '/update',
  failureRedirect: '/login',
  failureFlash: true
}));




app.post('/update', async(req, res)=>{

  try{

    var findOrderNumber = await models.orders.update({ orderNumber: req.body.orderNumber }, {
      where: {
        customerName: req.body.customerName
      }
    });

  res.redirect('/');
 } catch(ex){
  res.render('orders/edit.ejs', ex)
  }
})

//----------------------------Facebook Login--------------------------------------------------


app.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

//-----------------------------------------------------------------------

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')

  
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login',)
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)


