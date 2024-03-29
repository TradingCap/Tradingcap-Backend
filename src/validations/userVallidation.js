const yup = require('yup')

const makePaymentSchema = yup.object().shape({
  body: yup.object().shape({
    amount: yup.number().required('Amount is Required'),
    coinName: yup.string().required('Coin name is Required')
  })
})

const sendInviteLinkSchema = yup.object().shape({
  body: yup.object().shape({
    referrerLink: yup.string().required('Referrer link is Required'),
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required')
  })
})

const sendMailTosupport = yup.object().shape({
  body: yup.object().shape({
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
    body: yup.string().required('Email body is Required')
  })
})

module.exports = {
  makePaymentSchema,
  sendInviteLinkSchema,
  sendMailTosupport
}
