var express = require('express')
var router = express.Router()
const { validate } = require('express-yup')
const adminValidator = require('../../validations/adminVallidation')
const adminController = require('../../controllers/adminController')
const authMiddleware = require('../../middlewares/authMiddleware')

router.post(
  '/sign-up',
  validate(adminValidator.signupSchema),
  authMiddleware.verifyAdmin,
  adminController.signup
)

router.post(
  '/sign-in',
  validate(adminValidator.signinSchema),
  authMiddleware.verifyAdmin,
  adminController.signin
)

router.get(
  '/get-user-payment',
  authMiddleware.verifyAdmin,
  adminController.getUserPayment
)

router.put(
  '/update-user',
  authMiddleware.verifyAdmin,
  adminController.updateUser
)

module.exports = router
