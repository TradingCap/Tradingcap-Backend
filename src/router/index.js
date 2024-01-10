const express = require('express')
const router = express.Router()
const authRouter = require('./api/authRouter')
const userRouter = require('./api/userRouter')
const adminRouter = require('./api/adminRouter')
const utilRouter = require('./api/utilRouter')

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/admin', adminRouter)
router.use('/health', utilRouter)

module.exports = router
