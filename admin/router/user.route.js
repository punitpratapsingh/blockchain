const express = require("express");
const router = express.Router();

const userController = require("../controller/user.controller");
const userValidation = require("../validator/user.validator");
const { verifyJWTToken } = require("../../middleware/jwt.middleware");

router.get(
    "/list?",
    userValidation.getUserList,
    verifyJWTToken,
    userController.userList,
);

router.get("/:id", verifyJWTToken, userController.getUser);

router.put(
    "/:id?",
    userValidation.updateUser,
    verifyJWTToken,
    userController.updateUser,
);

router.patch(
    "/password/:id?",
    userValidation.changePassword,
    verifyJWTToken,
    userController.editUserPassword,
);

router.patch(
    "/kyc/:id",
    userValidation.updateUserKyc,
    verifyJWTToken,
    userController.updateUserKyc,
);

router.post(
    "/move/referral/:id",
    userValidation.updateUserReferral,
    verifyJWTToken,
    userController.updateUserReferral,
);

router.delete("/:id?", verifyJWTToken, userController.deleteUser);
router.get("/referal/:id?", verifyJWTToken, userController.getUserReferalData);

router.get(
    "/referral/tree",
    verifyJWTToken,
    userController.getUserReferralAllList,
);

module.exports = router;
