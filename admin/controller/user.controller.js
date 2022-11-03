const bcrypt = require("bcrypt");
const Users = require("../../models/users.model");
const { uploadFileToS3 } = require("../../utils/awsS3");
const path = require("path");
const saltRounds = 10;
const mongoose = require("mongoose");
const async = require("async");

module.exports.updateUser = async (request, response, next) => {
    try {
        const { user, name, isEmailVerified, allowReferral } = request.body;
        const { id } = request.params;

        let updateData = {};

        if (request.files && request.files.profileImage) {
            const { profileImage } = request.files;

            const fileName = `user-profile/${new Date().getTime()}${path.extname(
                profileImage.name,
            )}`;

            const Uploaded = await uploadFileToS3(
                fileName,
                profileImage.mimetype,
                profileImage,
            );
            if (Uploaded === false) {
                return response.status(200).json({
                    status: false,
                    message: "Error While Update Circle",
                    data: null,
                });
            }

            updateData = {
                name,
                isEmailVerified,
                allowReferral,
                profileImage: fileName,
            };
        } else {
            updateData = {
                name,
                isEmailVerified,
                allowReferral,
            };
        }

        const userData = await Users.findByIdAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                $set: updateData,
            },
            {
                new: true,
            },
        );
        if (!userData) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "User Not Found",
                data: null,
            });
        }

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "user Update successfully",
            data: userData,
        });
    } catch (e) {
        console.log(e);
        return response.status(200).json({
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.userList = async (request, response, next) => {
    try {
        const { page, sizePerPage, search, startDate, endDate, kycStatue } =
            request.query;

        const options = {
            page,
            limit: sizePerPage,
            sort: { createdAt: -1 },
        };
        let query = { isDeleted: false, role: { $ne: "ADMIN" } };

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else {
            if (startDate) {
                query.createdAt = { $gte: new Date(startDate) };
            }
            if (endDate) {
                query.createdAt = { $lte: new Date(endDate) };
            }
        }

        if (kycStatue) {
            query = {
                "kyc.status": kycStatue,
                isDeleted: false,
                role: { $ne: "ADMIN" },
            };
            if (startDate && endDate) {
                query.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            } else {
                if (startDate) {
                    query.createdAt = { $gte: new Date(startDate) };
                }
                if (endDate) {
                    query.createdAt = { $lte: new Date(endDate) };
                }
            }
        }

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search } },
                    { email: { $regex: search } },
                ],
                isDeleted: false,
                role: { $ne: "ADMIN" },
            };
        }

        const userData = await Users.paginate(query, options);

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "user List get successfully",
            data: userData,
        });
    } catch (e) {
        console.log(
            "%c 🍍 e: ",
            "font-size:20px;background-color: #EA7E5C;color:#fff;",
            e,
        );
        return response.status(200).json({
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.getUser = async (request, response, next) => {
    try {
        const { id } = request.params;

        let userData = {};
        userData = await Users.findOne({
            _id: id,
            isDeleted: false,
        }).lean();
        if (!userData) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "User Not Found",
                data: null,
            });
        }

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "User data get successfully",
            data: userData,
        });
    } catch (e) {
        console.log(
            "%c 🍏 e: ",
            "font-size:20px;background-color: #F5CE50;color:#fff;",
            e,
        );
        return response.status(200).json({
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.editUserPassword = async (request, response, next) => {
    try {
        const { id } = request.params;
        const { password } = request.body;
        const passwordSalt = await bcrypt.genSalt(saltRounds);
        const pass = await bcrypt.hash(password, passwordSalt);

        const userData = await Users.findOneAndUpdate(
            {
                _id: id,
            },
            { $set: { password: pass } },
            { new: true },
        );
        if (!userData) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "User Not Found",
                data: null,
            });
        }

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "User Password Updated successfully",
            data: userData,
        });
    } catch (e) {
        return response.status(200).json({
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.deleteUser = async (request, response, next) => {
    try {
        const { id } = request.params;

        const userData = await Users.findOneAndUpdate(
            {
                _id: id,
            },
            { $set: { isDeleted: true } },
            { new: true },
        );
        if (!userData) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "User Not Found",
                data: null,
            });
        }

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "User Deleted successfully",
            data: userData,
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

module.exports.updateUserKyc = async (request, response, next) => {
    try {
        const { id } = request.params;
        const { status, user } = request.body;

        const userData = await Users.findByIdAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                $set: {
                    "kyc.status": status,
                    "kyc.isApprovedBy": user._id,
                },
            },
            {
                new: true,
            },
        );
        if (!userData) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "User Not Found",
                data: null,
            });
        }

        return response.status(200).json({
            status: true,
            message: "Update Kyc Successfully",
            data: userData,
        });
    } catch (e) {
        console.log("%c 🍫 e", "color:#ea7e5c", e);
        return response.status(500).json({
STATUSCODE: 500,
            status: false,
            message: "Something Went Wrong",
            data: null,
        });
    }
};
module.exports.getUserReferalData = async (request, response, next) => {
    try {
        const { id } = request.params;
        const userReferralData = await Users.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                },
            },
            {
                $graphLookup: {
                    from: "users",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "fromUser",
                    as: "referaldata",
                    depthField: "depth",
                },
            },
            {
                $unwind: "$referaldata",
            },
        ]);

        return response.send({
            status: true,
            message: "All under team",
            data: userReferralData,
        });
    } catch (error) {
        console.log(error);
        return response.send({
            status: false,
            message: error.isMongoError
                ? error.error
                : "Something went wrong. Please try again",
        });
    }
};

module.exports.getUserReferralAllList = async (request, response, next) => {
    try {
        const { user } = request.query;

        const mainUserData = await Users.findOne({ _id: user });

        const userReferralData = await Users.find({ fromUserView: user });

        if (!userReferralData) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "User Not Found",
                data: null,
            });
        }

        let referralData = [];
        async.each(
            userReferralData,
            async (element) => {
                try {
                    const getUserREferralData = await getReferralData(
                        element._id,
                    );

                    referralData.push({
                        _id: element._id ? element._id : "",
                        name: element.name ? element.name : "",
                        email: element.email ? element.email : "",
                        userName: element.userName ? element.userName : "",
                        isEmailVerified: element.isEmailVerified
                            ? element.isEmailVerified
                            : "",
                        referralCode: element.referralCode
                            ? element.referralCode
                            : "",
                        profileImage: element.profileImage
                            ? element.profileImage
                            : "",
                        children: getUserREferralData,
                    });
                } catch (error) {
                    console.log(
                        "%c 🌽 error: ",
                        "font-size:20px;background-color: #B03734;color:#fff;",
                        error,
                    );
                }
            },
            () => {
                let sendData = {
                    _id: mainUserData._id ? mainUserData._id : "",
                    name: mainUserData.name ? mainUserData.name : "",
                    email: mainUserData.email ? mainUserData.email : "",
                    isEmailVerified: mainUserData.isEmailVerified
                        ? mainUserData.isEmailVerified
                        : "",
                    referralCode: mainUserData.referralCode
                        ? mainUserData.referralCode
                        : "",
                    userName: mainUserData.userName
                        ? mainUserData.userName
                        : "",
                    profileImage: mainUserData.profileImage
                        ? mainUserData.profileImage
                        : "",
                    children: referralData,
                };
                return response.json({
                    status: true,
                    message: "user Plan Data get successfully",
                    data: sendData,
                });
            },
        );
    } catch (e) {
        console.log(
            "%c 🍓 e: ",
            "font-size:20px;background-color: #42b983;color:#fff;",
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

const getReferralData = async (userId) => {
    return new Promise(async (resolve) => {
        const userReferralData = await Users.find({ fromUserView: userId });

        if (userReferralData.length > 0) {
            let referralData = [];
            async.each(
                userReferralData,
                async (element) => {
                    const getUserREferralData = await getReferralData(
                        element._id,
                    );

                    referralData.push({
                        _id: element._id ? element._id : "",
                        name: element.name ? element.name : "",
                        email: element.email ? element.email : "",
                        userName: element.userName ? element.userName : "",
                        isEmailVerified: element.isEmailVerified
                            ? element.isEmailVerified
                            : "",
                        referralCode: element.referralCode
                            ? element.referralCode
                            : "",
                        profileImage: element.profileImage
                            ? element.profileImage
                            : "",
                        children: getUserREferralData,
                    });
                },
                () => {
                    resolve(referralData);
                },
            );
        } else resolve([]);
    });
};

module.exports.updateUserReferral = async (request, response, next) => {
    try {
        const { fromUser } = request.body;
        const { id } = request.params;

        const userData = await Users.findByIdAndUpdate(
            {
                _id: id,
                isDeleted: false,
            },
            {
                $set: { fromUser, fromUserView: fromUser },
            },
            {
                new: true,
            },
        );
        if (!userData) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "User Not Found",
                data: null,
            });
        }

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "user Update successfully",
            data: userData,
        });
    } catch (e) {
        console.log(e);
        return response.status(500).json({
STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};
