const Users = require("../models/users.model");
const Transactions = require("../models/transactions.model");
const Referral = require("../config/referralLevel.json");
const async = require("async");

module.exports.referralDistribution = async (
    fromUserId,
    toUserId,
    level,
    mainAmount,
) => {
    return new Promise(async (resolve) => {
        try {
            if (level > Referral.length) {
                resolve(true);
            } else {
                let referralData = Referral[level - 1];
                let amountToAdd = (referralData.bonus * mainAmount) / 100;
                await Transactions.create({
                    fromUser: fromUserId,
                    user: toUserId,
                    level: level,
                    type: "REFERRAL-INCOME",
                    amount: amountToAdd,
                    status: 1,
                });
                const updateUserBalance = await Users.findOneAndUpdate(
                    {
                        _id: toUserId,
                    },
                    {
                        $inc: {
                            balance: +amountToAdd,
                            referralBalance: +amountToAdd,
                        },
                    },
                    {
                        new: true,
                    },
                );
                if (updateUserBalance.fromUser) {
                    await referralDistribution(
                        fromUserId,
                        updateUserBalance.fromUser,
                        level + 1,
                        mainAmount,
                    );
                } else {
                    resolve(true);
                }
            }
        } catch (error) {
            console.log("%c 🍇 error", "color:#ea7e5c", error);
            resolve(true);
        }
    });
};

module.exports.referralViewAdd = async (fromUserId) => {
    return new Promise(async (resolve) => {
        const userReferralData = await Users.find({
            fromUserView: fromUserId,
        }).sort({ fromUserViewLevel: 1 });
        if (userReferralData && userReferralData.length < 2) {
            // await Users.findOneAndUpdate(
            //     { _id: userId },
            //     {
            //         $set: {
            //             fromUserView: fromUserId,
            //         },
            //     },
            //     {},
            // );
            resolve(fromUserId);
        } else {
            const getUserInsert = await getReferralData(fromUserId);
            // await Users.findOneAndUpdate(
            //     { _id: userId },
            //     {
            //         $set: {
            //             fromUserView: getUserInsert,
            //         },
            //     },
            //     {},
            // );
            resolve(getUserInsert);
        }
    });
};

const getReferralData = async (userId) => {
    return new Promise(async (resolve) => {
        try {
            const userReferralData = await Users.find({
                fromUserView: userId,
            }).sort({ fromUserViewLevel: 1 });
            if (userReferralData.length < 2) {
                resolve(userId);
            } else {
                let referralData = [];
                userReferralData.forEach((element) =>
                    referralData.push(element._id),
                );
                let insertUserId = null,
                    checkUserId = [];

                for (const element of referralData) {
                    if (!insertUserId) {
                        const getUserReferralList = await Users.find({
                            fromUserView: element,
                        }).sort({ fromUserViewLevel: 1 });
                        if (
                            !getUserReferralList ||
                            getUserReferralList.length < 1
                        ) {
                            insertUserId = element._id;
                        } else {
                            getUserReferralList.forEach((e) => {
                                checkUserId.push(e._id);
                            });
                        }
                    }
                }
                if (insertUserId) {
                    resolve(insertUserId);
                } else {
                    console.log(
                        "%c 🥤 checkUserId",
                        "color:#2eafb0",
                        checkUserId,
                    );
                    const result = await getReferralDataArr(checkUserId);
                    resolve(result);
                }
            }
        } catch (error) {
            console.log("%c 🍰 error", "color:#33a5ff", error);
        }
    });
};

const getReferralDataArr = async (userId) => {
    return new Promise(async (resolve) => {
        try {
            let checkUserArr = [],
                insertUserId = null,
                isMain = false;

            for (const element of userId) {
                if (!isMain) {
                    const userReferralData = await Users.find({
                        fromUserView: element,
                    }).sort({ fromUserViewLevel: 1 });
                    if (userReferralData.length < 1) {
                        insertUserId = element;
                        isMain = true;
                    } else {
                        let referralData = [];
                        userReferralData.forEach((element) =>
                            referralData.push(element._id),
                        );
                        for (const ele of referralData) {
                            if (!insertUserId) {
                                const getUserReferralList = await Users.find({
                                    fromUserView: ele,
                                }).sort({ fromUserViewLevel: 1 });
                                if (
                                    !getUserReferralList ||
                                    getUserReferralList.length < 1
                                ) {
                                    insertUserId = ele._id;
                                } else {
                                    getUserReferralList.forEach((e) => {
                                        checkUserArr.push(e._id);
                                    });
                                }
                            }
                        }
                    }
                }
            }
            if (insertUserId) {
                resolve(insertUserId);
            } else {
                const result = await getReferralDataArr(checkUserArr);
                resolve(result);
            }
        } catch (error) {
            console.log("%c 🥕 error", "color:#6ec1c2", error);
        }
    });
};
