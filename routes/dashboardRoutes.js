const express = require('express');
const router = express.Router();

const DashboardController = require('../controllers/DashboardController');

router.get('/hello', (req, res) => DashboardController.hello(req, res))

module.exports = router