const express = require('express');
const router = express.Router()

const LogsController = require('../controllers/LogsController');

router.post('/', (req, res) => LogsController.getAllLogs(req, res))
router.post('/inserts', (req, res) => LogsController.getAllInsertions(req, res))

module.exports = router