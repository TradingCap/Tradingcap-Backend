const User = require('../DB/models/user')
const Payment = require('../DB/models/payment')
const { v4: uuidv4 } = require('uuid')

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.userId })
      .select({
        password: false,
        __v: false
      })
      .populate('Payments')

    if (!user) {
      throw new NotFoundError('user not Found')
    }
    return res.status(200).json({
      success: true,
      message: 'User profile retrieved.',
      data: user
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

exports.makePayment = async (req, res) => {
  try {
    const { amount } = req.body
    const transactionid = uuidv4().replace(/[- ]/g, '')
    const payment = await Payment.create({
      user: req.userId,
      amount,
      transactionId: transactionid
    })
    let user = await User.findOne({ id: req.userId })
      .select({
        password: false,
        __v: false
      })
      user.payments.push(req.userId)
    return res.status(200).json({
      success: true,
      message: 'Payment submitted for review',
      data: payment
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.userId })

    if (payments.length === 0) {
      throw new NotFoundError('No payment history Found')
    }
    return res.status(200).json({
      success: true,
      message: 'Payments retrieved.',
      data: payments
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

exports.getPayment = async (req, res) => {
  try {
    const { transactionId } = req.params
    const payment = await Payment.findOne({ transactionId: transactionId })

    if (!payment) {
      throw new NotFoundError('payment not Found')
    }
    return res.status(200).json({
      success: true,
      message: 'Payment retrieved.',
      data: payment
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}
