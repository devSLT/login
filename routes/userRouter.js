const express = require('express')
const router = express.Router();
const userController = require('../controller/userController')

//Rota Login
router.post('/login', userController.login)

//Rota Signup
router.post('/signup', userController.signup)


module.exports = router