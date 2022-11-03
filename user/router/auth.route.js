const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");
const authValidator = require("../validator/auth.validator");

const { verifyJWTToken } = require("../../middleware/jwt.middleware");

router.post("/userRegister", authValidator.register, authController.register);

router.patch(
    "/verify/email/resend",
    authValidator.resendEmailVerification,
    verifyJWTToken,
    authController.resendEmailVerification,
);

router.patch(
    "/verify/email",
    authValidator.verifyAuthenticator,
    verifyJWTToken,
    authController.verifyEmail,
);

router.post("/login", authValidator.login, authController.login);

router.patch("/email/verify",  authController.verifyEmailOtp);

router.patch(
    "/email/resend",
    authValidator.resendEmailVerification,
    authController.resendEmailOtp,
);

router.patch(
    "/mobile/verify",
    authValidator.verifyMobile,
    verifyJWTToken,
    authController.verifyMobileOtp,
);

router.patch(
    "/mobile/resend",
    authValidator.resendMobileOtp,
    verifyJWTToken,
    authController.resendMobileOtp,
);

router.put(
    "/password",
    authValidator.changePassword,
    verifyJWTToken,
    authController.changePassword,
);

router.put(
    "/forgot/password",
    authValidator.login,
    authController.forgotPassword,
);

module.exports = router;
