const Users = require("../../models/users.model");
const path = require("path");
const { uploadFileToS3 } = require("../../utils/awsS3");
const mongoose = require("mongoose");
const async = require("async");

module.exports.userData = async (request, response, next) => {
    try {
        const { user } = request.body;

        const userData = await Users.findOne({
            _id: user._id,
            isDeleted: false,
        }).populate("fromUser");

        if (!userData) {
            return response.status(200).json({
                STATUSCODE: 404,               
                status: false,
                message: "User Not Found",
                data: null,
            });
        }

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "User Data get successfully",
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

module.exports.findUserByReferralCode = async (request, response, next) => {
    try {
        const { user } = request.body;
        const { referralCode } = request.params;

        const userData = await Users.findOne({
            referralCode,
            isDeleted: false,
        });

        if (!userData) {
            return response.status(200).json({
                STATUSCODE: 404,               
                status: false,
                message: "User Not Found",
                data: null,
            });
        }

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "User Data get successfully",
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

module.exports.updateUser = async (request, response, next) => {
    try {
        const { user, name, country, state, city, houseNo, zipcode, street, vaultId  } = request.body;

        // const checkUser =user, name  await Users.findOne({
        //     $or: [{ email: email.toLowerCase() }],
        //     isDeleted: false,
        //     _id: { $ne: user._id },
        // });
        // if (checkUser) {
        //     return response.status(409).json({
        //         status: false,
        //         message: "Your Email Is Already Registered",
        //         data: null,
        //     });
        // }

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
                    STATUSCODE: 400,
                    status: false,
                    message: "Error While Update Circle",
                    data: null,
                });
            }

            updateData = {
                name,
                profileImage: fileName,
                country, state, city, houseNo, zipcode, street, vaultId
            };
        } else {
            updateData = {
                name,
                country, state, city, houseNo, zipcode, street, vaultId
            };
        }

        const userData = await Users.findByIdAndUpdate(
            {
                _id: user._id,
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
                STATUSCODE: 404,               
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

module.exports.deleteUser = async (request, response, next) => {
    try {
        const { user } = request.body;

        const userData = await Users.findByIdAndUpdate(
            {
                _id: user._id,
                isDeleted: false,
            },
            {
                $set: { isDeleted: true },
            },
            {
                new: true,
            },
        );
        if (!userData) {
            return response.status(200).json({
                STATUSCODE: 404,               
                status: false,
                message: "User Not Found",
                data: null,
            });
        }

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "user Deleted successfully",
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

module.exports.addUserKyc = async (request, response, next) => {
    try {
        const { user, mobile, documentType, documentName, documentNumber } =
            request.body;

        const { documentImage } = request.files;

        const fileName = `user-kyc/${new Date().getTime()}${path.extname(
            documentImage.name,
        )}`;

        const Uploaded = await uploadFileToS3(
            fileName,
            documentImage.mimetype,
            documentImage,
        );
        if (Uploaded === false) {
            return response.status(200).json({
                STATUSCODE: 400,               
                status: false,
                message: "Error While Update Circle",
                data: null,
            });
        }

        const userData = await Users.findByIdAndUpdate(
            {
                _id: user._id,
                isDeleted: false,
                "kyc.status": "PENDING",
            },
            {
                $set: {
                    kyc: {
                        mobile,
                        documentType,
                        documentName,
                        documentNumber,
                        documentImage: fileName,
                        isSubmittedOn: Math.round(Date.now() / 1000),
                        status: "IN-PROCESS",
                    },
                },
            },
            {
                new: true,
            },
        );
        if (!userData) {
            return response.status(200).json({
                STATUSCODE: 404,               
                status: false,
                message: "User Not Found Or Your KYC is already added",
                data: null,
            });
        }

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "user Strategy successfully",
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

module.exports.addUserAddress = async (request, response, next) => {
    try {
        const { user, address } = request.body;

        const userData = await Users.findOneAndUpdate(
            {
                _id: user._id,
                isDeleted: false,
            },
            {
                $set: {
                    address: address,
                },
            },
            {
                new: true,
            },
        );
        if (!userData) {
            return response.status(200).json({
                STATUSCODE: 404,               
                status: false,
                message: "User Not Found ",
                data: null,
            });
        }

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "user Address successfully added",
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

module.exports.userReferalData = async (request, response, next) => {
    try {
        const { user } = request.body;

        const userReferralData = await Users.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(user._id),
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
            STATUSCODE: 200,
            status: true,
            message: "All under team",
            data: userReferralData,
        });
    } catch (error) {
        return response.send({
            STATUSCODE: 500,
            status: false,
            message: error.isMongoError
                ? error.error
                : "Something went wrong. Please try again",
        });
    }
};

module.exports.getUserReferralAllList = async (request, response, next) => {
    try {
        const { user } = request.body;

        const mainUserData = await Users.findOne({ _id: user._id });

        const userReferralData = await Users.find({
            fromUserView: user._id,
            isEmailVerified: true,
        }).sort({ fromUserViewLevel: 1 });

        if (!userReferralData) {
            return response.status(200).json({
                STATUSCODE: 404,               
                status: false,
                message: "User Not Found",
                data: null,
            });
        }

        let referralData = [];
        for (const element of userReferralData) {
            try {
                const getUserREferralData = await getReferralData(element._id);

                referralData.push({
                    _id: element._id ? element._id : "",
                    name: element.name ? element.name : "",
                    email: element.email ? element.email : "",
                    referralCode: element.referralCode
                        ? element.referralCode
                        : "",
                    userName: element.userName ? element.userName : "",
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
        }
        let sendData = {
            _id: mainUserData._id ? mainUserData._id : "",
            name: mainUserData.name ? mainUserData.name : "",
            email: mainUserData.email ? mainUserData.email : "",
            userName: mainUserData.userName ? mainUserData.userName : "",
            referralCode: mainUserData.referralCode
                ? mainUserData.referralCode
                : "",
            profileImage: mainUserData.profileImage
                ? mainUserData.profileImage
                : "",
            children: referralData,
        };
        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "user Plan Data get successfully",
            data: sendData,
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

const getReferralData = async (userId) => {
    return new Promise(async (resolve) => {
        const userReferralData = await Users.find({
            fromUserView: userId,
            isEmailVerified: true,
        }).sort({ fromUserViewLevel: 1 });

        if (userReferralData.length > 0) {
            let referralData = [];
            for (const element of userReferralData) {
                const getUserREferralData = await getReferralData(element._id);

                referralData.push({
                    _id: element._id ? element._id : "",
                    name: element.name ? element.name : "",
                    email: element.email ? element.email : "",
                    userName: element.userName ? element.userName : "",
                    referralCode: element.referralCode
                        ? element.referralCode
                        : "",
                    profileImage: element.profileImage
                        ? element.profileImage
                        : "",
                    children: getUserREferralData,
                });
            }
            resolve(referralData);
        } else resolve([]);
    });
};
