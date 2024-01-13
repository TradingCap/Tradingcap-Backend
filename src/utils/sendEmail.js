require('dotenv').config()
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const EMAIL_SERVER = process.env.EMAIL_SERVER
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_FROM_TRADING_CAP = process.env.TRADING_CAP
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
const EMAIL_PORT = process.env.EMAIL_PORT

exports.sendEmailVerification = async (user, token) => {
  const transporter = nodemailer.createTransport({
    host: EMAIL_SERVER,
    port: +EMAIL_PORT,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  })
  const options = {
    viewEngine: {
      extName: '.hbs',
      layoutsDir: __dirname + '/../../src/views/email',
      partialsDir: __dirname + '/../../src/views/email',
      defaultLayout: 'trading-cap-verification-message.hbs'
    },
    extName: '.hbs' /* or '.handlebars' */,
    viewPath: __dirname + '/../../src/views/email',
    layoutsDir: __dirname + '/../../src/views/email',
    partialsDir: __dirname + '/../../src/views/email',
    defaultLayout: ''
  }
  await transporter.use('compile', hbs(options))
  // send mail with defined transport object
  /*let info =*/ transporter.sendMail({
    from: `${'TRADING CAP <' + EMAIL_FROM_TRADING_CAP + '>'}`, // sender address
    to: user.email, // list of receivers
    subject: 'Welcome message', // Subject line
    context: {
      name: user.email,
      token: token
    },
    template: 'trading-cap-verification-message'
  })
}

// exports.sendPasswordResetSuccessMail = async user => {
//   const transporter = nodemailer.createTransport({
//     host: EMAIL_SERVER,
//     port: +EMAIL_PORT,
//     secure: false,
//     auth: {
//       user: EMAIL_USER,
//       pass: EMAIL_PASSWORD // generated ethereal password
//     },
//     tls: {
//       rejectUnauthorized: false
//     }
//   })
//   const options = {
//     viewEngine: {
//       extName: '.hbs',
//       layoutsDir: __dirname + '/../../src/views/email',
//       partialsDir: __dirname + '/../../src/views/email',
//       defaultLayout: 'trading-cap-reset-password-success.hbs'
//     },
//     extName: '.hbs' /* or '.handlebars' */,
//     viewPath: __dirname + '/../../src/views/email',
//     layoutsDir: __dirname + '/../../src/views/email',
//     partialsDir: __dirname + '/../../src/views/email',
//     defaultLayout: ''
//   }
//   await transporter.use('compile', hbs(options))
//   // send mail with defined transport object
//   /*let info =*/ transporter.sendMail({
//     from: `${'TRADING CAP <' + EMAIL_FROM_TRADING_CAP + '>'}`, // sender address
//     to: user.email, // list of receivers
//     subject: 'Password reset status', // Subject line
//     context: {
//       name: user.email
//     },
//     template: 'trading-cap-reset-password-success'
//   })
// }

exports.sendPasswordResetMail = async (user, token) => {
  const transporter = nodemailer.createTransport({
    host: EMAIL_SERVER,
    port: +EMAIL_PORT,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  })
  const options = {
    viewEngine: {
      extName: '.hbs',
      layoutsDir: __dirname + '/../../src/views/email',
      partialsDir: __dirname + '/../../src/views/email',
      defaultLayout: 'trading-cap-reset-password.hbs'
    },
    extName: '.hbs' /* or '.handlebars' */,
    viewPath: __dirname + '/../../src/views/email',
    layoutsDir: __dirname + '/../../src/views/email',
    partialsDir: __dirname + '/../../src/views/email',
    defaultLayout: ''
  }
  await transporter.use('compile', hbs(options))
  // send mail with defined transport object
  transporter.sendMail({
    from: `${'TRADING CAP <' + EMAIL_FROM_TRADING_CAP + '>'}`, // sender address
    to: user.email, // list of receivers
    subject: 'Password reset', // Subject line
    context: {
      name: user.email,
      token: token
    },
    template: 'trading-cap-reset-password'
  })
}

exports.sendPaymentEmail = async (user, amount, transactionId, date) => {
  const transporter = nodemailer.createTransport({
    host: EMAIL_SERVER,
    port: +EMAIL_PORT,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  })
  const options = {
    viewEngine: {
      extName: '.hbs',
      layoutsDir: __dirname + '/../../src/views/email',
      partialsDir: __dirname + '/../../src/views/email',
      defaultLayout: 'trading-cap-payment-message.hbs'
    },
    extName: '.hbs' /* or '.handlebars' */,
    viewPath: __dirname + '/../../src/views/email',
    layoutsDir: __dirname + '/../../src/views/email',
    partialsDir: __dirname + '/../../src/views/email',
    defaultLayout: ''
  }
  await transporter.use('compile', hbs(options))
  // send mail with defined transport object
  /*let info =*/ transporter.sendMail({
    from: `${'TRADING CAP <' + EMAIL_FROM_TRADING_CAP + '>'}`, // sender address
    to: user.email, // list of receivers
    subject: 'Payment message', // Subject line
    context: {
      name: user.email,
      amount: amount,
      transactionId: transactionId,
      date: date
    },
    template: 'trading-cap-payment-message'
  })
}

exports.sendInviteEmail = async (user, email, referrerLink) => {
  const transporter = nodemailer.createTransport({
    host: EMAIL_SERVER,
    port: +EMAIL_PORT,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  })
  const options = {
    viewEngine: {
      extName: '.hbs',
      layoutsDir: __dirname + '/../../src/views/email',
      partialsDir: __dirname + '/../../src/views/email',
      defaultLayout: 'trading-cap-send-invite-link.hbs'
    },
    extName: '.hbs' /* or '.handlebars' */,
    viewPath: __dirname + '/../../src/views/email',
    layoutsDir: __dirname + '/../../src/views/email',
    partialsDir: __dirname + '/../../src/views/email',
    defaultLayout: ''
  }
  await transporter.use('compile', hbs(options))
  // send mail with defined transport object
  /*let info =*/ transporter.sendMail({
    from: `${'TRADING CAP <' + EMAIL_FROM_TRADING_CAP + '>'}`, // sender address
    to: email, // list of receivers
    subject: 'Trading Cap Invitation', // Subject line
    context: {
      name: user.email,
      email: email,
      referrerLink: referrerLink
    },
    template: 'trading-cap-send-invite-link'
  })
}

// exports.sendEmailToSupport = async (user, email, body) => {
//   const transporter = nodemailer.createTransport({
//     host: EMAIL_SERVER,
//     port: +EMAIL_PORT,
//     secure: false,
//     auth: {
//       user: EMAIL_USER,
//       pass: EMAIL_PASSWORD // generated ethereal password
//     },
//     tls: {
//       rejectUnauthorized: false
//     }
//   })
//   const options = {
//     viewEngine: {
//       extName: '.hbs',
//       layoutsDir: __dirname + '/../../src/views/email',
//       partialsDir: __dirname + '/../../src/views/email',
//       defaultLayout: 'trading-cap-send-invite-link.hbs'
//     },
//     extName: '.hbs' /* or '.handlebars' */,
//     viewPath: __dirname + '/../../src/views/email',
//     layoutsDir: __dirname + '/../../src/views/email',
//     partialsDir: __dirname + '/../../src/views/email',
//     defaultLayout: ''
//   }
//   await transporter.use('compile', hbs(options))
//   // send mail with defined transport object
//   /*let info =*/ transporter.sendMail({
//     from: `${'TRADING CAP <' + EMAIL_FROM_TRADING_CAP + '>'}`, // sender address
//     to: email, // list of receivers
//     subject: 'Trading Cap Invitation', // Subject line
//     context: {
//       name: user.email,
//       email: email,
//       referrerLink: referrerLink
//     },
//     template: 'trading-cap-send-invite-link'
//   })
// }
