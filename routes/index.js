const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require('../config/auth') 

//register page
router.get('/register', (req,res)=>{
    res.render('register');
})
router.get('/admin', ensureAuthenticated, (req,res)=>{
    res.render('admin',{
        user: req.user
    });
})
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        user: req.user
    });
})

module.exports = router; 