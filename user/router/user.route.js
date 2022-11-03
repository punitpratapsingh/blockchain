const express = require("express");
const router = express.Router();

const userController = require("../controller/user.controller");
const userValidation = require("../validator/user.validator");

const { verifyJWTToken } = require("../../middleware/jwt.middleware");

router.get("/", verifyJWTToken, userController.userData);

router.put(
    "/",
    userValidation.updateUser,
    verifyJWTToken,
    userController.updateUser,
);

router.put(
    "/kyc",
    userValidation.addUserKyc,
    verifyJWTToken,
    userController.addUserKyc,
);

router.put(
    "/address",
    userValidation.addUserAddress,
    verifyJWTToken,
    userController.addUserAddress,
);

router.delete("/", verifyJWTToken, userController.deleteUser);
router.get("/referral", verifyJWTToken, userController.userReferalData);
router.get(
    "/referral/tree",
    verifyJWTToken,
    userController.getUserReferralAllList,
);

router.get("/find/:referralCode", userController.findUserByReferralCode);

module.exports = router;
