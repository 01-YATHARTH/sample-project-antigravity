const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.post('/match', matchController.shortlistBasic);
router.post('/ai/shortlist', matchController.shortlistAI);

module.exports = router;
