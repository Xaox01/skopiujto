const express = require("express")
const app = express()
const http = require('http')
const router  = express.Router();

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.urlencoded({extended : false}));


app.use('/users',require('./routes/users'));


const Document = require("./models/Document")
const User = require("./models/User")
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://admin:admin@skopiujtodb.3rhktel.mongodb.net/?retryWrites=true&w=majority", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})



app.get("/", (req, res) => {
  const code = `Witamy w Skopiuj.to

Kliknij nowy tekst po prawej stronie by skopiować swój kod lub tekst po prawej stronie`

  res.render("code-display", { code, language: "plaintext" })
})

app.get("/login", (req, res) => {
  res.render('login')
})

app.get("/register", (req, res) => {
  res.render('register')
})

app.get("/new", (req, res) => {
  res.render("new")
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

app.get("/:id", async (req, res) => {
  const id = req.params.id
  try {
    const document = await Document.findById(id)

    res.render("code-display", { code: document.value, id })
  } catch (e) {
    res.redirect("/")
  }
})

app.get("/api/v1", async(req, res) => {
  res.render('api')
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
console.log('serwer uruchomiono na porcie ' + port)

module.exports = router; 
