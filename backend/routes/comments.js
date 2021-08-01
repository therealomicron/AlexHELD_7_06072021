
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const commentsCtrl = require('../controllers/comments');

router.get('/:id', auth, commentsCtrl.getAllComments);
router.post('/', auth, commentsCtrl.createComment);
router.put('/', auth, commentsCtrl.modifyComment);
router.delete('/:id', auth, commentsCtrl.deleteComment);

module.exports = router;
