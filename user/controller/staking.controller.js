const transactions = require("../../models/transactions.model");
const Users = require("../../models/users.model");
const Staking = require("../../config/staking.json");
const { referralDistribution } = require("../../utils/referral");

module.exports.getAllStaking = async (request, response, next) => {
    try {
        const { user } = request.body;

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "staking Tx Data Successfully",
            data: Staking,
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

module.exports.addStaking = async (request, response, next) => {
    try {
        const { user, plan, amount } = request.body;

        const userWalletData = await Users.findOne({
            _id: user._id,
        });

        const staking = await Staking[plan - 1];

        if (userWalletData.BGTBalance < amount) {
            return response.status(500).json({
                STATUSCODE: 500,
                status: false,
                message: "Wallet BGT BalanceIs Low Then Amount",
                data: null,
            });
        }

        const insertTransaction = await transactions.create({
            user: user._id,
            type: "STAKE-IN",
            stakingInterval: staking.interval,
            stakingInterest: staking.interest,
            stakingPlan: staking.plan,
            stakingMonth: staking.month,
            stakingTime: new Date().getTime(),
            interestInterval: staking.interestInterval,
            UnStakeTime: new Date().getTime() + staking.interval,
            amount: amount,
            status: 1,
        });

        const updateUserBalance = await Users.findOneAndUpdate(
            {
                _id: user._id,
            },
            {
                $inc: {
                    BGTBalance: -amount,
                    stakedBalance: amount,
                },
            },
            {
                new: true,
            },
        );
        // if (updateUserBalance.fromUser) {
        //     await referralDistribution(
        //         updateUserBalance._id,
        //         updateUserBalance.fromUser,
        //         1,
        //         amount,
        //     );
        // }

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "plan Buy Successfully",
            data: insertTransaction,
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
