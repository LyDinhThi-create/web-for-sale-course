function requireLogin(req, res, next) {
    if (req.session.user){
        next();
    }
    else{
    res.redirect('/login-register');
    }
    }
    module.exports = requireLogin;