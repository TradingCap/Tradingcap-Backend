var express = require('express')
var router = express.Router()
const { validate } = require('express-yup')
const userValidator = require('../../validations/userVallidation')
const userController = require('../../controllers/userController')
const authMiddleware = require('../../middlewares/authMiddleware')

router.get(
  '/get-payment/:transactionId',
  authMiddleware.verifyToken,
  userController.getPayment
)

router.get(
  '/get-payments',    
  authMiddleware.verifyToken,
  userController.getPayments
)

router.get(
  '/get-user-profile',
  authMiddleware.verifyToken,
  userController.getUserProfile
)

router.post(
  '/make-payment',
  validate(userValidator.makePaymentSchema),
  authMiddleware.verifyToken,
  userController.makePayment
)

module.exports = router
