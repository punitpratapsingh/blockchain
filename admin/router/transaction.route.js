const express = require("express");
const router = express.Router();

const transactionController = require("../controller/transaction.controller");
const transactionValidation = require("../validator/transaction.validator");
const { verifyJWTToken } = require("../../middleware/jwt.middleware");

router.get(
    "/",
    transactionValidation.getTransactions,
    verifyJWTToken,
    transactionController.getTransactions,
);

router.get("/:id", verifyJWTToken, transactionController.getSingleTransactions);

router.get(
    "/:id",
    transactionValidation.updateWithdrawTransaction,
    verifyJWTToken,
    transactionController.updateWithdrawTransaction,
);

module.exports = router;
