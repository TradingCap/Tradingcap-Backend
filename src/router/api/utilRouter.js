var express = require('express')
var router = express.Router()
const utilController = require('../../controllers/utilController')

router.get('', utilController.getHealthStatus)

module.exports = router
