const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

class AuthController {
  // Render login and register page
  renderLoginRegister(req, res) {
    res.render("pages/login-register", { title: "Đăng nhập / Đăng ký" });
  }
  async register(req, res,next) {
    try{
        const  email  = req.body.email;
        const user = await User.findOne({email});  
        if(!user||user==null){
            const user = await new User(req.body);
            await user.save();                      
            res.redirect('/login-register')
            res.status(201).json({ message: 'User registered successfully' });
            
        }
        else 
            {
                   
                res.status(200).json({ message: 'Email already exists. Please use a different email.' });
            }    
    }
    catch(err){
      next(err);
    }
  }
  async login(req, res,next) {
    try{
         const { email, password } = req.body;
        const user = await User.findOne({email})       
         if(!user){
            //res.json(user.email);
            res.status(200).json({ message: 'Email không tồn tại. Vui lòng đăng ký.' });
            return;
         }
         const match = await bcrypt.compare(password, user.password);
         if (!match) {
            res.status(200).json({ message: 'Mật khẩu không đúng. Vui lòng thử lại.' });
            
         }
         req.session.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,

        };
        user.statusLogin = true;
        await user.save();
        res.redirect('/');
    }
    catch(err){
      next(err);
    }
  }
    async logout(req, res, next) {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId);
        user.statusLogin = false;
        await user.save();
        req.session.destroy();
        res.redirect('/login-register');
    } catch (err) {
        next(err);
    }
}
}
module.exports = new AuthController;

