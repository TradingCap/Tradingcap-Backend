const yup = require('yup')

const makePaymentSchema = yup.object().shape({
  body: yup.object().shape({
    amount: yup.number().required('Amount is Required')
  })
})

module.exports = {
  makePaymentSchema
}
