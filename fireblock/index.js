const fs = require("fs");
const path = require("path");
const {FireblocksSDK, PeerType, TransactionArguments, TransactionOperation, TransactionStatus} = require("fireblocks-sdk");
const { assert } = require("console");

const apiSecret = fs.readFileSync(path.resolve(__dirname, "./fireblocks_secret.key"), "utf8");
const apiKey = "abc"
const fireblocks = new FireblocksSDK(apiSecret, apiKey);

module.exports.getVault = async (request, response, next) => {
    try {
        
        const vaultAccounts = await fireblocks.getVaultAccountsWithPageInfo();

        if (vaultAccounts) {
            return response.status(200).json({
                STATUSCODE: 200,   
                status: true,
                message: "Accounts get successfully",
                data: vaultAccounts,
            });
        } else {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Something went wrong",
                data: verifyData,
            });
        }
    } catch (e) {
        return response.status(500).json({
            STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.getVaultAccountsById = async (request, response, next) => {
    try {        
        const vaultAccounts = await fireblocks.getVaultAccountById(request.params.id);

        if (vaultAccounts) {
            return response.status(200).json({
                STATUSCODE: 200,   
                status: true,
                message: "Accounts get successfully",
                data: vaultAccounts,
            });
        } else {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Something went wrong",
                data: verifyData,
            });
        }
    } catch (e) {
        return response.status(500).json({
            STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.createVaultAccount = async (request, response, next) => {
    try {        
        const {name} = request.body;
        const createAccount = await fireblocks.createVaultAccount(name);

        if (createAccount.name == name ) {
            return response.status(200).json({
                STATUSCODE: 200,   
                status: true,
                message: "Accounts created successfully",
                data: createAccount,
            });
        } else {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Something went wrong",
                data: verifyData,
            });
        }
    } catch (e) {
        return response.status(500).json({
            STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.updateVaultAccount = async (request, response, next) => {
    try {        
        const {vaultId, name} = request.body;
        const account = await fireblocks.updateVaultAccount(vaultId, name);

        if (account.name == name) {
            return response.status(200).json({
                STATUSCODE: 200,   
                status: true,
                message: "Accounts updated successfully",
                data: account,
            });
        } else {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Something went wrong",
                data: verifyData,
            });
        }
    } catch (e) {
        return response.status(500).json({
            STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.getVaultAccountAsset = async (request, response, next) => {
    try {        
        const {vaultId, assetId} = request.body;
        const asset = await fireblocks.getVaultAccountAsset(vaultId, assetId);

        if (asset) {
            return response.status(200).json({
                STATUSCODE: 200,   
                status: true,
                message: "Asset get successfully",
                data: asset,
            });
        } else {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Something went wrong",
                data: verifyData,
            });
        }
    } catch (e) {
        console.log("%c 🍅 e", "color:#ea7e5c", e);
        return response.status(500).json({
            STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.getDepositAddresses = async (request, response, next) => {
    try {   
        const {vaultId, assetId} = request.body;     
        const depositAddresses = await fireblocks.getDepositAddresses(vaultId, assetId);

        if (depositAddresses) {
            return response.status(200).json({
                STATUSCODE: 200,   
                status: true,
                message: "Asset address get successfully",
                data: depositAddresses,
            });
        } else {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Something went wrong",
                data: verifyData,
            });
        }
    } catch (e) {
        return response.status(500).json({
            STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.createVaultAsset = async (request, response, next) => {
    try {   
        const {vaultId, assetId} = request.body;     
        const vaultAsset = await fireblocks.createVaultAsset(vaultId, assetId);

        if (vaultAsset) {
            return response.status(200).json({
                STATUSCODE: 200,   
                status: true,
                message: "Asset added successfully",
                data: vaultAsset,
            });
        } else {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Something went wrong",
                data: vaultAsset,
            });
        }
    } catch (e) {
        return response.status(500).json({
            STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.generateNewAddress = async (request, response, next) => {
    try {   
        const {vaultId, assetId} = request.body;     
        const address = await fireblocks.generateNewAddress(vaultId, assetId);

        if (address) {
            return response.status(200).json({
                STATUSCODE: 200,   
                status: true,
                message: "Asset added successfully",
                data: address,
            });
        } else {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Something went wrong",
                data: address,
            });
        }
    } catch (e) {
        return response.status(500).json({
            STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: e,
        });
    }
};

module.exports.generateNewAddress = async (request, response, next) => {
    try {   
        const {vaultId, assetId} = request.body;     
        const address = await fireblocks.generateNewAddress(vaultId, assetId);

        if (address) {
            return response.status(200).json({
                STATUSCODE: 200,   
                status: true,
                message: "Asset added successfully",
                data: address,
            });
        } else {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Something went wrong",
                data: address,
            });
        }
    } catch (e) {
        return response.status(500).json({
            STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: e,
        });
    }
};

module.exports.createTransaction = async (request, response, next) => {
    try {   

        console.log("%c 🍣", "color:#e41a6a", "INNNNN");
        const {vaultId, assetId, destinationId} = request.body; 
        console.log("%c 🍪 vaultId", "color:#ffdd4d", vaultId);
        const payload = {
            assetId: assetId,
            source: {
                type: "VAULT_ACCOUNT",
                id: vaultId
            },
            destination: {
                type: "VAULT_ACCOUNT",
                id: String(destinationId)
            },
            amount: String(1),
            fee: String(1),
            note: "Created by fireblocks SDK"
        };
            
        const address = await fireblocks.createTransaction(payload);
        console.log("%c 🥒 address", "color:#fca650", address);

        if (address) {
            return response.status(200).json({
                STATUSCODE: 200,   
                status: true,
                message: "Asset added successfully",
                data: address,
            });
        } else {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Something went wrong",
                data: address,
            });
        }
    } catch (e) {
        console.log("%c 🍎 e", "color:#2eafb0", e);
        return response.status(500).json({
            STATUSCODE: 500,
            status: false,
            message: "something Went To Wrong",
            data: e,
        });
    }
};


module.exports.getTransactionById = async (request, response, next) => {
    try {        
        const tx = await fireblocks.getTransactionById(request.params.txId);

        if (tx) {
            return response.status(200).json({
                STATUSCODE: 200,   
                status: true,
                message: "Asset list get successfully",
                data: tx,
            });
        } else {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Something went wrong",
                data: tx,
            });
        }
    } catch (e) {
        return response.status(500).json({
            STATUSCODE: 500,
            status: false,
            message: "Something Went Wrong",
            data: null,
        });
    }
};


module.exports.getSupportedAssets = async (request, response, next) => {
    try {        
        const asset = await fireblocks.getSupportedAssets();

        if (asset) {
            return response.status(200).json({
                STATUSCODE: 200,   
                status: true,
                message: "Asset list get successfully",
                data: asset,
            });
        } else {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Something went wrong",
                data: verifyData,
            });
        }
    } catch (e) {
        return response.status(500).json({
            STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};
