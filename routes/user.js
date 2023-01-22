const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const validatePassword = require('../middleware/password_validateur');

router.post('/signup', validatePassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
