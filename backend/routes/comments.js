
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const commentsCtrl = require('../controllers/comments');

router.get('/:id', auth, commentsCtrl.getAllComments);
router.post('/', auth, multer, commentsCtrl.createComment);
router.put('/', auth, multer, commentsCtrl.modifyComment);
router.delete('/', auth, commentsCtrl.deleteComment);

module.exports = router;
