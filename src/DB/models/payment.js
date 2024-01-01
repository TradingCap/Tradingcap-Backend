const mongoose = require('mongoose')
const Schema = mongoose.Schema

//  Define user Schema
const PaymentSchema = new Schema(
  {
    user: 
      {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    ,
    amount: {
      type: Number,
      required: true
    },
    transactionId: {
      type: String,
      required: true
    },
    status: {
        type: String,
        enum: ['APPROVED', 'PENDING'],
        default: 'PENDING'
      },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
)

const Payment = mongoose.model('payments', PaymentSchema)

module.exports = Payment
