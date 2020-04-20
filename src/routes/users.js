const express=require('express');
const router=express.Router();
const User=require('../models/User');
const passport=require('passport');

router.get('/users/signin',(req,res)=>{
    res.render('users/signin');
});
//Aquí no llamamos una función sino a la estrategia local que programamos en config/passport.js
router.post('/users/signin',passport.authenticate('local',{
    successRedirect:'/notes',
    failureRedirect:'/users/signin',
    failureFlash:true
}));

router.get('/users/signup',(req,res)=>{
    res.render('users/signup');
});
router.post('/users/signup',async (req,res)=>{
   const{name,email,password,confirm_password}=req.body;
   const errors=[];
   if(name.length<=0||email.length<=0||password.length<=0){
    errors.push({text:'Exist field empty'}) ;
   }
   if(password!=confirm_password){
       errors.push({text:'Password do not match'})
   }
   if (password.length<4) {
       errors.push({text:'Password mut be at least 4 characteres'});
       
   }
   if (errors.length>0) {
       res.render('users/signup',{errors,name,email,password,confirm_password});
   }else{
      const emailUser=await User.findOne({email:email});
      if (emailUser) {
          req.flash('error_msg','The email is already in use');
          res.redirect('/users/signup');
      }
      const newUser= new User({name,email,password});
      newUser.password=await newUser.encryptPassword(password);
      await newUser.save();
      req.flash('success_msg','You are registered');
      res.redirect('/users/signin');
   }
});
router.get('/users/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});


module.exports=router;