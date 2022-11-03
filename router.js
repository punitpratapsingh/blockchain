const express = require("express");
const router = express.Router();

const userRouter = require("./user/router/router");
const adminRouter = require("./admin/router/router");
const fireblockRouter = require("./fireblock/router");

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/fireblock", fireblockRouter);

module.exports = router;
