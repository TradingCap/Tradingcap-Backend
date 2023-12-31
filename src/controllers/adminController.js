require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const catchAsync = require('express-async-handler')
const send = require('../utils/sendEmail')
const makeOtp = require('../utils/otp')

const User = require('../DB/models/user')

exports.signup = catchAsync(async (req, res) => {
  const { fullName, email, password } = req.body
  const emailToken = makeOtp(4)

  const existUser = await User.findOne({ email: email.toLowerCase() })
  if (existUser) {
    return res.status(400).json({ msg: 'User already exists' })
  }

  const newUser = await User.create({
    fullName,
    password,
    email: email.toLowerCase(),
    emailToken: emailToken,
    userType: 'ADMIN'
  })

  const token = jwt.sign(
    { id: newUser.id, userType: newUser.userType },
    process.env.JWT_SECRET,
    {
      expiresIn: 86400 // 24 hours
    }
  )

  await send.sendEmailVerification(newUser, emailToken)

  return res.status(200).json({
    success: true,
    message:
      'User was registered successfully! An confirmation code has been sent to your email for verification.',
    accessToken: token
  })
})

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ${email} doesn't exist.` })
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password)

    if (!passwordIsValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password!'
      })
    }

    const verifyStatus = user.emailVerified === true

    if (!verifyStatus) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your acoount'
      })
    }

    const accountStatus = user.status === 'ACTIVE'

    if (!accountStatus) {
      return res.status(401).json({
        success: false,
        message: 'User account is inactive, contact support!'
      })
    }

    const token = jwt.sign(
      { id: user.id, userType: user.userType },
      process.env.JWT_SECRET,
      {
        expiresIn: 86400
      }
    )

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken: token,
      data: user
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

exports.getUserPayment = catchAsync(async (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      'User was registered successfully! An confirmation code has been sent to your email for verification.',
    accessToken: token
  })
})

exports.updateUser = catchAsync(async (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      'User was registered successfully! An confirmation code has been sent to your email for verification.',
    accessToken: token
  })
})
