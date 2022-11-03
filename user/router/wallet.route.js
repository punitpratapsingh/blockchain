const express = require("express");
const router = express.Router();

const walletController = require("../controller/wallet.controller");
const walletValidation = require("../validator/wallet.validator");

const { verifyJWTToken } = require("../../middleware/jwt.middleware");

router.get(
    "/",
    walletValidation.getUserWalletTransactions,
    verifyJWTToken,
    walletController.getUserWalletTransactions,
);

router.get(
    "/payment/address",
    verifyJWTToken,
    walletController.getAllPaymentWallet,
);

router.get("/:id", verifyJWTToken, walletController.getSingleTransactions);

router.patch(
    "/check",
    walletValidation.checkWallet,
    verifyJWTToken,
    walletController.checkBalance,
);

router.post(
    "/swap",
    walletValidation.swapWallet,
    verifyJWTToken,
    walletController.swapWallet,
);

router.post(
    "/transfer",
    walletValidation.transferWallet,
    verifyJWTToken,
    walletController.transferWallet,
);

router.post(
    "/withdraw",
    walletValidation.withdraw,
    verifyJWTToken,
    walletController.withdraw,
);

module.exports = router;
