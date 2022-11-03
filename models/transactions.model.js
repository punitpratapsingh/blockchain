const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
require("@mongoosejs/double");
const { Schema } = mongoose;

const WalletTX = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        staking: {
            type: Schema.Types.ObjectId,
            ref: "WalletTX",
        },
        fromUser: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
        withdrawBy: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
        toUser: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
        level: {
            type: Number,
        },
        chain: {
            type: String,
            enum: ["RINKEBY"],
        },
        type: {
            type: String,
            enum: [
                "DEPOSIT",
                "WITHDRAW",
                "REWARD",
                "REFERRAL-INCOME",
                "SYSTEM-REWARD",
                "STAKE-IN",
                "STAKE-OUT",
                "STAKING-INTEREST",
                "SWAP-BGT-TO-BGUSD",
                "SWAP-BGUSD-TO-BGT",
                "INTERNAL-TRANSFER",
            ],
            required: true,
        },
        stakingInterest: {
            type: Schema.Types.Double,
        },
        stakingPlan: {
            type: Number,
        },
        stakingMonth: {
            type: Number,
        },
        stakingInterval: {
            type: String,
        },
        stakingTime: {
            type: String,
        },
        interestInterval: {
            type: String,
        },
        UnStakeTime: {
            type: String,
        },
        lastInterestTime: {
            type: String,
        },
        address: {
            type: String,
        },
        fromAddress: {
            type: String,
        },
        toAddress: {
            type: String,
        },
        blockNumber: {
            type: String,
        },
        txHash: {
            type: String,
        },
        quantity: {
            type: Schema.Types.Double,
        },
        amount: {
            type: Schema.Types.Double,
            required: true,
        },
        amountOut: {
            type: Schema.Types.Double,
        },
        time: {
            type: Date,
        },
        status: {
            type: Number,
            default: 0,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

WalletTX.plugin(mongoosePaginate);

module.exports =
    mongoose.models.WalletTX || mongoose.model("WalletTX", WalletTX);
