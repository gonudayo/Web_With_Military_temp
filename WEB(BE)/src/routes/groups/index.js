const express = require('express');

const router = express.Router();
const { auth } = require('../../middleware/auth');
const ctrl = require('./groups.ctrl');

router.post('/create', auth, ctrl.process.create);
router.post('/approve', auth, ctrl.process.approve);
router.post('/search', ctrl.process.search);
router.post('/waiting', auth, ctrl.process.waiting);
router.post('/profile', ctrl.process.profile);
router.post('/edit', auth, ctrl.process.edit);

module.exports = router;