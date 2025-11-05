const express=require("express");
const AuthController = require("../controllers/authController");
const blockLoginIfLogedin = require('../middlewares/blockLoginIfLogedin');
const router = express.Router();

router.post("/logout", AuthController.logout);
router.post("/login-register/login", AuthController.login);
router.post("/login-register/register", AuthController.register);
router.get("/login-register", blockLoginIfLogedin, AuthController.renderLoginRegister);

module.exports = router;