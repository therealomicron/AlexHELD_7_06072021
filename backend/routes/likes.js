
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const likesCtrl = require('../controllers/likes');

router.get('/', auth, likesCtrl.getAllLikes);
router.post('/', auth, multer, likesCtrl.createLike);
router.get('/:id', auth, likesCtrl.getOneLike);
router.put('/:id', auth, multer, likesCtrl.modifyLike);
router.delete('/:id', auth, likesCtrl.deleteLike);

module.exports = router;
