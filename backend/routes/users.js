var express = require('express');
var router = express.Router();


const userCtrl = require('../controllers/users');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/suppression', userCtrl.suppression);

module.exports = router;
