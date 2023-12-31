const express = require("express");
const router = express.Router();
const authRouter = require('./api/authRouter')
const userRouter = require('./api/userRouter')
const adminRouter = require('./api/adminRouter')

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);

module.exports = router;