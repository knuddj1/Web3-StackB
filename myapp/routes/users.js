var express = require('express');
var router = express.Router();

const userController = require('../controllers/users');

router.get('/', userController.index);

module.exports = router;
