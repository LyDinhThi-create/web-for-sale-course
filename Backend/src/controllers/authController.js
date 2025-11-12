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
            req.flash('successMsg', 'Đăng ký thành công! Vui lòng đăng nhập.');               
            return  res.redirect('/login-register');
        }
        else 
            {
                req.flash('errorMsg', 'Email đã tồn tại. Vui lòng sử dụng email khác.');
              return  res.redirect('/login-register');
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
            // res.status(200).json({ message: 'Email không tồn tại. Vui lòng đăng ký.' });
            // return;
            req.flash('errorMsg', 'Email không tồn tại. Vui lòng đăng ký.');
            return res.redirect('/login-register');

         }
         const match = await bcrypt.compare(password, user.password);
         if (!match) {

            req.flash('errorMsg', 'Mật khẩu không đúng. Vui lòng thử lại.');
            return res.redirect('/login-register');

         }
         req.session.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            statusLogin: user.statusLogin,
            cart: user.cart,
            wishlist: user.wishlist,
            purchasedCourses: user.purchasedCourses,
            enrolledCourses: user.enrolledCourses,
            slug: user.slug, 
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
        const userEmail = req.session.user.email;
        const user = await User.findOne({ email: userEmail });
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

