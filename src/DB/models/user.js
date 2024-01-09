const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

//  Define user Schema
const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: [true, 'user already exists!!!']
    },
    emailToken: {
      type: String
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: true
    },
    passwordToken: {
      type: String,
    },
    referrer: {
      type: String,
    },
    userRef: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PENDING', 'INACTIVE'],
      default: 'PENDING'
    },
    userType: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    },
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'payments'
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret._id = ret.id
        delete ret.password
        delete ret.__v
        return ret
      }
    }
  }
)

//  method to hash password beefore saving to database
UserSchema.pre('save', async function (next) {
  const user = this

  //  if password is modified, do nothing
  if (!user.isModified('password')) return next()

  this.email = this.email.toLowerCase()
  //  hash password
  const hash = await bcrypt.hash(this.password, 10)

  this.password = hash
  next()
})

// user trying to log in has the correct credentials.
UserSchema.methods.isValidPassword = async function (password) {
  const user = this
  const compare = await bcrypt.compare(password, user.password)

  return compare
}

const User = mongoose.model('users', UserSchema)

module.exports = User
