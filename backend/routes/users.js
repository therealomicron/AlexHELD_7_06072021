var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');

const userCtrl = require('../controllers/users');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/suppression', auth, userCtrl.suppression);

module.exports = router;
