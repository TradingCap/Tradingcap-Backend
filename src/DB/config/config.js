const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const connectDB = async () => {
  try {
    let URI
    if (process.env.NODE_ENV === 'production') {
      URI = process.env.PROD_MONGO_URI
    } else {
      URI = process.env.DEV__MONGO_URI
    }

    await mongoose.connect(URI)
    console.log(`Database Connected`)
  } catch (error) {
    console.log(error)
    console.log('There is an error in the database', error)
    process.exit(1)
  }
}

module.exports = connectDB
