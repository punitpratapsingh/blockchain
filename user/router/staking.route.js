const express = require("express");
const router = express.Router();

const stakingController = require("../controller/staking.controller");
const stakingValidation = require("../validator/staking.validator");

const { verifyJWTToken } = require("../../middleware/jwt.middleware");

router.get("/", verifyJWTToken, stakingController.getAllStaking);

router.post(
    "/",
    stakingValidation.addStaking,
    verifyJWTToken,
    stakingController.addStaking,
);

module.exports = router;
