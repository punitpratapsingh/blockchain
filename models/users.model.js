const mongoose = require("mongoose");
const { Schema } = mongoose;
require("@mongoosejs/double");
const mongoosePaginate = require("mongoose-paginate-v2");

const Users = new Schema(
    {
        userName: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        referralCode: {
            type: String,
        },
        password: {
            type: String,
            select: false,
        },
        profileImage: {
            type: String,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        depositAddress: {
            type: String,
            default: false,
        },
        address: {
            bsc: {
                type: String,
            },
            ethereum: {
                type: String,
            },
            polygon: {
                type: String,
            },
            tron: {
                type: String,
            },
        },

        kyc: {
            mobile: {
                type: String,
            },
            documentNumber: {
                type: String,
            },
            documentName: {
                type: String,
            },
            documentImage: {
                type: String,
            },
            documentImageBack: {
                type: String,
            },
            panDocumentNumber: {
                type: String,
            },
            panDocumentName: {
                type: String,
            },
            panDocumentImage: {
                type: String,
            },
            isSubmittedOn: {
                type: String,
            },
            status: {
                type: String,
                enum: ["APPROVED", "PENDING", "REJECTED", "IN-PROCESS"],
                default: "PENDING",
            },
            isApprovedBy: {
                type: Schema.Types.ObjectId,
                ref: "Users",
            },
        },
        allowReferral: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },
        fromUser: {
            type: Schema.Types.ObjectId,
            ref: "Users",
            default: null,
        },
        fromUserView: {
            type: Schema.Types.ObjectId,
            ref: "Users",
            default: null,
        },
        fromUserViewLevel: {
            type: Number,
            default: 1,
        },
        balance: {
            type: Schema.Types.Double,
            required: true,
            default: 0,
        },
        BGTBalance: {
            type: Schema.Types.Double,
            required: true,
            default: 0,
        },
        totalTeamTurnover: {
            type: Schema.Types.Double,
            required: true,
            default: 0,
        },
        stakedBalance: {
            type: Schema.Types.Double,
            required: true,
            default: 0,
        },
        rewardBalance: {
            type: Schema.Types.Double,
            required: true,
            default: 0,
        },
        referralBalance: {
            type: Schema.Types.Double,
            required: true,
            default: 0,
        },
        stakingRewardBalance: {
            type: Schema.Types.Double,
            required: true,
            default: 0,
        },
        mobile: {
            type: String
        },
        country: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        street: {
            type: String
        },
        houseNo: {
            type: String
        },
        zipcode: {
            type: String
        },
        vaultId:{
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    },
);

Users.plugin(mongoosePaginate);

// module.exports = mongoose.model("Users", Users);

module.exports = mongoose.models.Users || mongoose.model("Users", Users);
