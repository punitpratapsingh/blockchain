const express = require("express");
const router = express.Router();

const fireblockController = require("./index");

router.get("/getVault", fireblockController.getVault);

router.get("/getVaultAccountsById/:id", fireblockController.getVaultAccountsById);

router.get("/getSupportedAssets", fireblockController.getSupportedAssets);

router.get("/getTransactionById/:txId", fireblockController.getTransactionById);

router.post("/createVaultAccount", fireblockController.createVaultAccount);

router.post("/getVaultAccountAsset", fireblockController.getVaultAccountAsset);

router.post("/createVaultAsset", fireblockController.createVaultAsset);

router.post("/generateNewAddress", fireblockController.generateNewAddress);

router.post("/createTransaction", fireblockController.createTransaction);

router.post("/getDepositAddresses", fireblockController.getDepositAddresses);

router.put("/updateVaultAccount", fireblockController.updateVaultAccount);

module.exports = router;