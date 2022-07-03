const express = require('express');
const router  = express.Router();
const User = require("../models/User.js")
//login page
router.get('/', (req,res)=>{
    res.render('welcome');
})
//register page
router.get('/register', (req,res)=>{
    res.render('register');
})

module.exports = router; 