"use strict";

var express = require('express');
var router = express.Router();
var statusController = require('../controllers/statusController');

router.get('/:username', statusController.getStatus);
router.post('/', statusController.postStatus);

module.exports = router;
