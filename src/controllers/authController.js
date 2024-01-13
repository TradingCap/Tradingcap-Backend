require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const catchAsync = require('express-async-handler')
const send = require('../utils/sendEmail')
const makeOtp = require('../utils/otp')
const { v4: uuidv4 } = require('uuid')

const User = require('../DB/models/user')

exports.signup = catchAsync(async (req, res) => {
  const { fullName, email, password } = req.body
  const { referrer } = req.query
  const userRef = uuidv4().replace(/[- ]/g, '').slice(0, 8)
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
    userRef: userRef,
    referrer: referrer
  })

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: 86400 // 24 hours
  })

  await send.sendEmailVerification(newUser, emailToken)

  return res.status(200).json({
    success: true,
    message:
      'User was registered successfully! A confirmation code has been sent to your email for verification.',
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
        message: 'Please verify your account'
      })
    }

    const accountStatus = user.status === 'ACTIVE'

    if (!accountStatus) {
      return res.status(401).json({
        success: false,
        message: 'User account is inactive, contact support!'
      })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400
    })

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

exports.signout = async (req, res) => {
  try {
    return res.clearCookie('access_token').status(200).json({
      success: true,
      message: 'Logged out successfully!'
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

exports.updatePassword = catchAsync(async (req, res) => {
  try {
    let user = await User.findOne({
      email: req.body.email
    })

    if (!user) {
      return res.status(500).json({ message: 'Invalid User' })
    }

    user.password = req.body.password //await bcrypt.hash(req.body.password, 10)
    await user.save()

    // await send.sendPasswordResetSuccessMail(user)
    return res.status(200).json({ message: 'Password changed successfully.' })
  } catch (err) {
    throw res.status(500).json({ message: err.message })
  }
})

exports.sendPasswordResetOtp = catchAsync(async (req, res) => {
  let token = makeOtp(4)
  let user = await User.findOne({
    email: req.body.email
  })

  user.passwordToken = token
  await user.save()
  await send.sendPasswordResetMail(user, token)
  return res
    .status(200)
    .json({ message: 'Kindly check your email for your OTP.' })
})

exports.resendPasswordResetOtp = catchAsync(async (req, res) => {
  let token = makeOtp(4)
  let user = await User.findOne({
    email: req.body.email
  })

  user.passwordToken = token
  await user.save()
  await send.sendPasswordResetMail(user, token)
  return res
    .status(200)
    .json({ message: 'Kindly check your email for your OTP.' })
})

exports.verifyResetPassword = catchAsync(async (req, res) => {
  let user = await User.findOne({
    email: req.body.email,
    passwordToken: req.body.otp,
    status: 'ACTIVE'
  })
  if (!user) {
    throw res.status(400).json({ message: 'Invalid or incorrect OTP & email' })
  }

  user.passwordToken = null
  await user.save()

  return res.status(201).json({ message: 'Password reset otp verified' })
})

exports.sendEmailConfirmation = catchAsync(async (req, res) => {
  const token = makeOtp(4)
  let user = await User.findOne({
    email: req.body.email
  })

  user.emailToken = token
  await user.save()
  await send.sendEmailVerification(user, token)
  return res
    .status(200)
    .json({ message: 'Kindly check your email for your confirmation code.' })
})

exports.verifyEmailConfirmation = catchAsync(async (req, res) => {
  let user = await User.findOne({
    email: req.body.email,
    emailToken: req.body.otp
  })

  if (!user) {
    throw res.status(400).json({ message: 'Invalid or incorrect OTP & email' })
  }

  user.emailVerified = true
  user.emailToken = null
  user.status = 'ACTIVE'
  await user.save()
  return res.status(200).json({ message: 'Email verified successfully.' })
})
