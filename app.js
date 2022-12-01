const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();
const http = require('http')
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");
const {ensureAuthenticated} = require('./config/auth') 





const Document = require("./models/Document")
//passport config:
require('./config/passport')(passport)
//mongoose
mongoose.connect('mongodb+srv://admin:admin@skopiujtodb.3rhktel.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('connected'))
.catch((err)=> console.log(err));

//EJS
app.set('view engine','ejs');
app.use(express.static("public"))
//BodyParser
app.use(express.urlencoded({extended : false}));
//express session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
    })
    
//Routes

app.get("/", (req, res) => {
    const code = `Witamy w Skopiuj.to
  Kliknij nowy tekst po prawej stronie by skopiować swój kod lub tekst po prawej stronie`
  
    res.render("code-display", { code, language: "plaintext" })
  })
  
  app.get("/new", (req, res) => {
    res.render("new")
  })

  app.get("/admin", ensureAuthenticated, (req, res) =>{
    res.render("admin")
  })
  
  app.post("/save", async (req, res) => {
    const value = req.body.value
    try {
      const document = await Document.create({ value })
      res.redirect(`/${document.id}`)
    } catch (e) {
      res.render("new", { value })
    }
  })

  app.get("/:id/duplicate", async (req, res) => {
    const id = req.params.id
    try {
      const document = await Document.findById(id)
      res.render("new", { value: document.value })
    } catch (e) {
      res.redirect(`/${id}`)
    }
  })

  router.delete("/delete/:id", async (req, res) => {
    try {
      // First find the user admin wants to delete
      const user = await User.findById(req.params.id) // getting id from the id you put in url
  
      // Make sure the user who wants to delete another user is an admin
      if (user.admin) {
         await user.deleteOne() // This deletes the user
      } else {
         res.status(403).json("You are not allowed to do this action!")
      }
    } catch (error) {
      res.sendStatus(500);
    }
  });
  
  app.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
      const document = await Document.findById(id)
  
      res.render("code-display", { code: document.value, id })
    } catch (e) {
      res.redirect("/")
    }
  })

  function setUser(req, res, next) {
  const userId = req.body.userId
  if (userId) {
    req.user = users.find(user => user.id === userId)
  }
  next()
}


  

  app.use('/users',require('./routes/index'));
  app.use('/users',require('./routes/users'));
  

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
console.log('serwer uruchomiono na porcie ' + port)