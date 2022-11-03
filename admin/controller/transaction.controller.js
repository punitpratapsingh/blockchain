const transactions = require("../../models/transactions.model");
const usersModel = require("../../models/users.model");

module.exports.getTransactions = async (request, response, next) => {
    try {
        const { user } = request.body;
        const { page, sizePerPage, chain, type, status, userId, fromUserId } =
            request.query;

        const options = {
            page,
            limit: sizePerPage,
            sort: { createdAt: -1 },
            populate: {
                path: "user",
                select: "userName name email profileImage",
            },
            populate: {
                path: "fromUser",
                select: "userName name email profileImage",
            },
        };
        let query = {};
        if (type) {
            query.type = type;
        }
        if (userId) {
            query.user = userId;
        }
        if (fromUserId) {
            query.fromUser = fromUserId;
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
            message: "Tx Data Successfully",
            data: getWalletTxList,
        });
    } catch (e) {
        console.log(
            "%c 🍌 e: ",
            "font-size:20px;background-color: #E41A6A;color:#fff;",
            e,
        );
        return response.status(200).json({
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

        const getWalletTxList = await transactions.findOne({ _id: id });

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
            message: "Tx Data Successfully",
            data: getWalletTxList,
        });
    } catch (e) {
        console.log(
            "%c 🍌 e: ",
            "font-size:20px;background-color: #E41A6A;color:#fff;",
            e,
        );
        return response.status(200).json({
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.updateWithdrawTransaction = async (request, response, next) => {
    try {
        const { user, txHash, status } = request.body;
        const { id } = request.params;

        const getWalletTxList = await transactions.findOneAndUpdate(
            {
                type: "WITHDRAW",
                _id: id,
            },
            {
                $set: {
                    status,
                    txHash,
                    withdrawBy: user._id,
                },
            },
            {
                new: true,
            },
        );

        if (!getWalletTxList) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "Error While Get Post List",
                data: null,
            });
        }

        if (status == 2) {
            const updateUser = await usersModel.findOneAndUpdate(
                {
                    _id: getWalletTxList.user,
                },
                {
                    $inc: {
                        BGTBalance: getWalletTxList.amount,
                    },
                },
                {
                    new: true,
                },
            );
        }
        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "Tx Data Successfully",
            data: getWalletTxList,
        });
    } catch (e) {
        console.log(
            "%c 🍌 e: ",
            "font-size:20px;background-color: #E41A6A;color:#fff;",
            e,
        );
        return response.status(200).json({
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};
