const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');
const { uuid } = require('uuidv4');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');


const transporter = nodemailer.createTransport({
    host: "poczta.o2.pl",
    port: 465,
    auth: {
    user: "legia1000.2000@o2.pl",
    pass: "Taktaknie123%"
  }
});


//login handleSS
router.get('/login',(req,res)=>{
    res.render('login');
})
router.get('/register',(req,res)=>{
    res.render('register')
    })
//Register handle
router.post('/login',(req,res,next)=>{
passport.authenticate('local',{
    successRedirect : '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash : true
})(req,res,next)
})
  //register post handle
  router.post('/register',(req,res)=>{
    const role = 0;
    const {name,email, password, password2} = req.body;
    let errors = [];
    console.log(' Name: ' + name+ ' email:' + email+ ' pass:' + password + role+ 'role:' );
    if(!name || !email || !password || !password2) {
        errors.push({msg : "Wypełnij wszystkie pola!"})
    }
    if(email.length < 6 || email.length > 40 ) {
        errors.push({msg : "Mail jest nieprawidłowy"});
    }
    if(name.length < 4 ) {
        errors.push({msg : "nick musi zawierac przynajmniej 4 znaki!"});
    }
    if(name.length > 25 ) {
        errors.push({msg : "nick jest za długi!"});
    }
    //check if match
    if(password !== password2) {
        errors.push({msg : "Hasła do siebie nie pasują!"});
    }
    
    
    //check if password is more than 6 characters
    if(password.length < 6 ) {
        errors.push({msg : 'Hasło musi zawierać 6 znaków!'})
    }
    if(errors.length > 0 ) {
    res.render('register', {
        errors : errors,
        name : name,
        email : email,
        role : role,
        password : password,
        password2 : password2})
     } else {
        //validation passed
       User.findOne({email : email}).exec((err,user)=>{
        console.log(user);   
        if(user) {
            errors.push({msg: 'Ten mail jest już zajęty!'});
            res.render('register',{errors,name,email,password,password2})  
           } else {
            
            const newUser = new User({
                name : name,
                email : email,
                role : role,
                password : password
            });
            
            
            //hash password
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newUser.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newUser.password = hash;
                    //save user
                    newUser.save()
                    .then((value)=>{
                        //send mail to user
                        const mailOptions = {
                            from: 'legia1000.2000@tlen.pl', // sender address
                            to: email, // list of receivers
                            subject: 'Potwierdzenie rejestracji', // Subject line
                            html: 'Hej ' + name // plain text body
                        }
                        transporter.sendMail(mailOptions, function (err, info) {
                            if(err)
                                console.log(err)
                            else
                                console.log(info);
                        })                 
                        console.log(value)
                        req.flash('success_msg','Rejestracja się powiodła');
                        res.redirect('/users/login');
                    })
                    .catch(value=> console.log(value));
                      
                }));
             }
       })
    }
    })
    
//logout
router.get('/logout',(req,res)=>{
req.logout();
req.flash('success_msg','Now logged out');
res.redirect('/users/login'); 
})
module.exports  = router;