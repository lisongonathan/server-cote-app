const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

router.post('/', (req, res) => UserController.annees(req, res))
router.post('/auth', (req, res) => UserController.authentication(req, res))

module.exports = router