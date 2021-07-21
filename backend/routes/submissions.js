const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const submissionsCtrl = require('../controllers/submissions');

router.get('/', auth, submissionsCtrl.getAllSubmissions);
router.post('/', auth, multer, submissionsCtrl.createSubmission);
router.get('/:id', auth, submissionsCtrl.getOneSubmission);
router.put('/:id', auth, multer, submissionsCtrl.modifySubmission);
router.delete('/:id', auth, submissionsCtrl.deleteSubmission);
router.post('/:id/like', auth, submissionsCtrl.likeSubmission);

module.exports = router;
