const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const walletRouter = require("./wallet.route");
const stakingRouter = require("./staking.route");
const supportRouter = require("./support.route");

router.use("/auth", authRouter);
router.use("/profile", userRouter);
router.use("/wallet", walletRouter);
router.use("/staking", stakingRouter);
router.use("/support", supportRouter);

module.exports = router;
