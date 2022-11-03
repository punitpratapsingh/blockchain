const transactions = require("../../models/transactions.model");
const Users = require("../../models/users.model");
const { getTxDataData } = require("../../utils/wallet");
const WALLET = require("../../config/wallet.json");
const { BGT_PRICE } = require("../../config/config");

module.exports.getAllPaymentWallet = async (request, response, next) => {
    try {
        const { user } = request.body;

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "WAllet Data Successfully",
            data: WALLET,
        });
    } catch (e) {
        return response.status(500).json({
STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.swapWallet = async (request, response, next) => {
    try {
        const { user, type, amount } = request.body;

        const userWalletData = await Users.findOne({
            _id: user._id,
        });

        if (type == "BGUSD") {
            if (userWalletData.balance < amount) {
                return response.status(500).json({
STATUSCODE: 500,
                    status: false,
                    message: "Wallet BalanceIs Low Then Amount",
                    data: null,
                });
            }
            const BGTAmount = amount / BGT_PRICE;

            const insertTransaction = await transactions.create({
                user: user._id,
                type: "SWAP-BGUSD-TO-BGT",
                amount: amount,
                amountOut: BGTAmount,
                status: 1,
            });

            const updateUserBalance = await Users.findOneAndUpdate(
                {
                    _id: user._id,
                },
                {
                    $inc: {
                        balance: -amount,
                        BGTBalance: BGTAmount,
                    },
                },
                {
                    new: true,
                },
            );
            return response.json({
                status: true,
                message: "Swap Successfully",
                data: updateUserBalance,
            });
        } else if (type == "BGT") {
            if (userWalletData.BGTbalance < amount) {
                return response.status(500).json({
STATUSCODE: 500,
                    status: false,
                    message: "Wallet BalanceIs Low Then Amount",
                    data: null,
                });
            }
            const BGUSDAmount = amount * BGT_PRICE;

            const insertTransaction = await transactions.create({
                user: user._id,
                type: "SWAP-BGT-TO-BGUSD",
                amount: amount,
                amountOut: BGUSDAmount,
                status: 1,
            });

            const updateUserBalance = await Users.findOneAndUpdate(
                {
                    _id: user._id,
                },
                {
                    $inc: {
                        balance: BGUSDAmount,
                        BGTBalance: -amount,
                    },
                },
                {
                    new: true,
                },
            );
            return response.json({
                status: true,
                message: "Swap Successfully",
                data: updateUserBalance,
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

module.exports.getUserWalletTransactions = async (request, response, next) => {
    try {
        const { user } = request.body;
        const { page, sizePerPage, chain, type, status } = request.query;

        const options = {
            page,
            limit: sizePerPage,
            sort: { createdAt: -1 },
        };
        let query = {
            user: user._id,
        };
        if (type) {
            query.type = type;
        }
        if (chain) {
            query.chain = chain;
        }
        if (status) {
            query.status = status;
        }

        const getWalletTxList = await transactions.paginate(query, options);

        if (!getWalletTxList) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "Error While Get Post List",
                data: null,
            });
        }

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "Wallet Tx Data Successfully",
            data: getWalletTxList,
        });
    } catch (e) {
        console.log(
            "%c 🍌 e: ",
            "font-size:20px;background-color: #E41A6A;color:#fff;",
            e,
        );
        return response.status(500).json({
STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.getSingleTransactions = async (request, response, next) => {
    try {
        const { user } = request.body;
        const { id } = request.params;

        const getWalletTxList = await transactions.findById(id);

        if (!getWalletTxList) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "Error While Get Post List",
                data: null,
            });
        }

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "Wallet Tx Data Successfully",
            data: getWalletTxList,
        });
    } catch (e) {
        console.log(
            "%c 🍌 e: ",
            "font-size:20px;background-color: #E41A6A;color:#fff;",
            e,
        );
        return response.status(500).json({
STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.checkBalance = async (request, response, next) => {
    try {
        const { user, type } = request.body;

        const userWalletData = await Users.findOne({
            _id: user._id,
        });

        const getLatestTx = await transactions
            .findOne({
                user: user._id,
                chain: "BSC",
                type: "DEPOSIT",
            })
            .sort({ blockNumber: -1 });

        const txData = await getTxDataData(
            "BSC",
            userWalletData.address.bsc,
            getLatestTx ? getLatestTx.blockNumber : 0,
            user._id,
        );

        await transactions.insertMany(txData.data);

        const updateUserBalance = await Users.findOneAndUpdate(
            {
                _id: user._id,
            },
            {
                $inc: {
                    balance: txData.amount,
                },
            },
            {
                new: true,
            },
        );

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "User wallet balance fetch successfully",
            data: updateUserBalance,
        });
    } catch (e) {
        console.log("e: ", e);
        return response.status(500).json({
STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.transferWallet = async (request, response, next) => {
    try {
        const { user, amount, toUserId } = request.body;
        if (user._id == toUserId) {
            return response.status(500).json({
STATUSCODE: 500,
                status: false,
                message: "Please Enter valid user",
                data: null,
            });
        }

        const userWalletData = await Users.findOne({
            _id: user._id,
        });

        if (userWalletData.balance < amount) {
            return response.status(500).json({
STATUSCODE: 500,
                status: false,
                message: "Wallet BalanceIs Low Then Amount",
                data: null,
            });
        }

        await transactions.create({
            user: user._id,
            toUser: toUserId,
            type: "INTERNAL-TRANSFER",
            amount: amount,
            status: 1,
        });

        const updateUserBalance = await Users.findOneAndUpdate(
            {
                _id: user._id,
            },
            {
                $inc: {
                    balance: -amount,
                },
            },
            {
                new: true,
            },
        );

        await transactions.create({
            user: toUserId,
            fromUser: user._id,
            type: "INTERNAL-TRANSFER",
            amount: amount,
            status: 1,
        });

        const updateUserBalanceIn = await Users.findOneAndUpdate(
            {
                _id: toUserId,
            },
            {
                $inc: {
                    balance: amount,
                },
            },
            {
                new: true,
            },
        );

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "Transfer Successfully",
            data: updateUserBalance,
        });
    } catch (e) {
        return response.status(500).json({
STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.withdraw = async (request, response, next) => {
    try {
        const { user, amount, address } = request.body;

        const userWalletData = await Users.findOne({
            _id: user._id,
        });

        if (userWalletData.BGTBalance < amount) {
            return response.status(500).json({
STATUSCODE: 500,
                status: false,
                message: "Wallet BalanceIs Low Then Amount",
                data: null,
            });
        }

        await transactions.create({
            user: user._id,
            address: address,
            type: "WITHDRAW",
            amount: amount,
            status: 0,
        });

        const updateUserBalance = await Users.findOneAndUpdate(
            {
                _id: user._id,
            },
            {
                $inc: {
                    BGTBalance: -amount,
                },
            },
            {
                new: true,
            },
        );

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "Transfer Successfully",
            data: updateUserBalance,
        });
    } catch (e) {
        console.log("%c 🧀 e", "color:#f5ce50", e);
        return response.status(500).json({
STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};
