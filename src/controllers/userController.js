const User = require('../DB/models/user')
const Payment = require('../DB/models/payment')
const { v4: uuidv4 } = require('uuid')
const send = require('../utils/sendEmail')

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId })
      .select({
        password: false,
        __v: false
      })
      .populate('payments')

    if (!user) {
      return res.status(500).json({ message: 'User not found.' })
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
    const { amount, coinName } = req.body
    const transactionid = uuidv4().replace(/[- ]/g, '').slice(0, 8)

    const coin = Object.freeze({
      BITCOIN: 'BITCOIN',
      "USDT (TRC20)": 'USDT (TRC20)',
      "ETH (ERC20)": 'ETH (ERC20)'
    })

    let coinNameValue
    if (coinName) {
      coinNameValue = coinName.toUpperCase()
    }

    if (Object.keys(coin).includes(coinNameValue)) {
      coinNameValue = coin[coinNameValue]
    } else {
      return res.status(400).json({
        success: false,
        message: 'coin name invalid'
      })
    }

    const payment = await Payment.create({
      user: req.userId,
      amount,
      transactionId: transactionid,
      coinName: coinNameValue
    })

    let user = await User.findOne({ _id: req.userId }).select({
      password: false,
      __v: false
    })
    user.payments.push(payment._id)

    await user.save()
    await send.sendPaymentEmail(user, amount)

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

    if (!payments) {
      return res.status(500).json({ message: 'No payment history found.' })
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
      return res.status(500).json({ message: 'Payment not found.' })
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

exports.getReferrerLink = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId }).select({
      password: false,
      __v: false
    })

    if (!user) {
      return res.status(500).json({ message: 'User not found.' })
    }

    const referrer = `${user.fullName.split(' ')[0]}-${user.userRef}`
    const referrerLink = `${process.env.BASE_URL}/api/auth/sign-up?referrer=${referrer}`

    return res.status(200).json({
      success: true,
      message: 'Link retrieved.',
      referrerLink
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

exports.sendInviteLink = async (req, res) => {
  try {
    const { email, referrerLink } = req.body

    const user = await User.findOne({ _id: req.userId }).select({
      password: false,
      __v: false
    })

    if (!user) {
      return res.status(500).json({ message: 'User not found.' })
    }

    await send.sendInviteEmail(user, email, referrerLink)

    return res.status(200).json({
      success: true,
      message: 'Invite sent'
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}
