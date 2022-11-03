const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../../models/users.model");
const config = require("../../config/config");
const twillio = require("../../utils/twilio");
const saltRounds = 10;
const {
    generateRandomString,
    generateNumericString,
} = require("../../helpers");
const { referralViewAdd } = require("../../utils/referral");

async function getUniqueUserReferralCode(referral) {
    return new Promise(async (resolve) => {
        var ref = referral ? referral : generateRandomString(8);

        referralExists = await Users.findOne({
            referralCode: ref,
        });

        if (!referralExists) {
            resolve(ref);
        } else {
            await getUniqueReferral(generateRandomString(8));
        }
    });
}

async function getUniqueUserName(useName) {
    return new Promise(async (resolve) => {
        var ref = useName ? useName : generateRandomString(6);

        useNameExists = await Users.findOne({
            userName: ref,
        });

        if (!useNameExists) {
            resolve(ref);
        } else {
            await getUniqueUserName(generateRandomString(6));
        }
    });
}

module.exports.register = async (request, response, next) => {
    try {
        const { name, email, password, referral, fromUserView, mobile, country, state, city, houseNo, zipcode, street } = request.body;
        let userReferralViewData = fromUserView;
        // check if user is exists
        const checkUser = await Users.findOne({
            email: email.toLowerCase(),
            isDeleted: false,
        });
        if (checkUser) {
            return response.status(200).json({
                STATUSCODE: 409,               
                status: false,
                message: "Your Email Is Already Registered",
                data: null,
            });
        }

        let checkReferral = false;
        if (referral) {
            checkReferral = await Users.findOne({
                referralCode: referral,
                allowReferral: true,
                isDeleted: false,
            });
            if (!checkReferral) {
                return response.status(200).json({
                    STATUSCODE: 422,
                    status: false,
                    message: "Please Enter a Valid Referral Code",
                    data: null,
                });
            }
        }
        // if (!userReferralViewData) {
        //     userReferralViewData = await referralViewAdd(checkReferral._id);
        // }
        // const getUserReferralData = await Users.count({
        //     fromUserView: userReferralViewData,
        // });

        //GENERATING PASSWORD
        const passwordSalt = await bcrypt.genSalt(saltRounds);
        const pass = await bcrypt.hash(password, passwordSalt);

        const referralCode = await getUniqueUserReferralCode();
        // const userName = await getUniqueUserName();

        // sending otp
        // await twillio.sendOtpInEmail(email);

        //CREATING USER IN MONGODB
        let newUsers = await Users.create({
            name,
            userName: referralCode,
            referralCode: referralCode,
            email: email.toLowerCase(),
            password: pass,
            twoFactorAuthentication: true,
            fromUser:
                checkReferral && checkReferral._id ? checkReferral._id : null,
            fromUserView:
                checkReferral && checkReferral._id ? checkReferral._id : null,
            fromUserViewLevel: 1,
            mobile, country, state, city, houseNo, zipcode, street
        });

        //jwt tokens
        const token = jwt.sign(JSON.stringify(newUsers), config.JWT_AUTH_TOKEN);

        delete newUsers.password;
        const sendData = { userData: newUsers, token: token };

        return response.status(200).json({
            STATUSCODE: 200,
            status: true,
            message: "Register successfully",
            data: sendData,
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

module.exports.verifyEmail = async (request, response, next) => {
    try {
        const { user, code } = request.body;

        const userData = await Users.findOne({
            _id: user._id,
            isDeleted: false,
        });
        if (userData.isEmailVerified) {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Your Email Is Already Verified",
                data: null,
            });
        } else {
            // const verifyData = await twillio.verifyOtp(userData.email, code);
            const verifyData = code == 123123 ? "approved" : "rejected";
            if (verifyData == "approved") {
                const updateUserData = await Users.findOneAndUpdate(
                    { _id: user._id },
                    { $set: { isEmailVerified: true } },
                    { new: true },
                );
                if (!updateUserData) {
                    response.status(200).json({
                        STATUSCODE: 404,
                        status: false,
                        message: "User Data Not Found",
                        data: null,
                    });
                }
                return response.json({
                    STATUSCODE: 200,
                    status: true,
                    message: "Email Verified Successfully",
                    data: updateUserData,
                });
            } else {
                return response.status(200).json({
                    STATUSCODE: 422,
                    status: false,
                    message: "Enter Valid OTP",
                    data: null,
                });
            }
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

module.exports.resendEmailVerification = async (request, response, next) => {
    try {
        const { user, email } = request.body;

        const userData = await Users.findOne({
            _id: user._id,
            isDeleted: false,
        });
        if (!userData) {
            return response.status(200).json({
                STATUSCODE: 200,               
                status: false,
                message: "User Not Found",
                data: null,
            });
        }
        if (userData.email != email.toLowerCase()) {
            // check if user is exists
            const checkUser = await Users.findOne({
                email: email.toLowerCase(),
                isDeleted: false,
            });
            if (checkUser) {
                return response.status(200).json({
                    STATUSCODE: 409,
                    status: false,
                    message:
                        "You Email Already Exists Please Try Different Email",
                    data: null,
                });
            }
            const updateUserData = await models.Users.findOneAndUpdate(
                { _id: user._id },
                { $set: { email: email.toLowerCase() } },
                { new: true },
            );
            if (!updateUserData) {
                return response.status(200).json({
                    STATUSCODE: 400,
                    status: false,
                    message: "Error While Change Your Email",
                    data: null,
                });
            }
            // await twillio.sendOtpInEmail(email);
            return response.status(200).json({
                STATUSCODE: 200,
                status: true,
                message: "Email Changed And Verification sent To Email",
                data: updateUserData,
            });
        } else {
            // const checkResendStatus = await twillio.reSendOtpInEmail(email);
            // if (!checkResendStatus) {
            //     return response.status(500).json({
            //         status: true,
            //         message: "Error While Send OTP",
            //         data: [],
            //     });
            // }
            return response.status(200).json({
                STATUSCODE: 200,
                status: true,
                message: "Verification sent To Email",
                data: userData,
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

module.exports.login = async (request, response, next) => {
    try {
        const { userName, password } = request.body;

        const userData = await Users.findOne({
            $or: [{ email: userName.toLowerCase() }, { userName: userName }],
            isDeleted: false,
        }).select("+password");

        if (!userData) {
            return response.status(200).json({
                STATUSCODE: 200,               
                status: false,
                message: "Email Not Found",
                data: null,
            });
        }

        const checkPassword = await bcrypt.compare(password, userData.password);
        if (!checkPassword) {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Password Is Not Match",
                data: null,
            });
        }

        delete userData.password;
        const token = jwt.sign(JSON.stringify(userData), config.JWT_AUTH_TOKEN);
        const sendData = { userData, token: token };
        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "Login successfully",
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

module.exports.verifyEmailOtp = async (request, response, next) => {
    try {
        const { email, code } = request.body;

        // const verifyData = await twillio.verifyOtp(email, code);
        const verifyData = code == 123123 ? "approved" : "rejected";

        if (verifyData == "approved") {
            return response.status(200).json({
                STATUSCODE: 200,   
                status: true,
                message: "Email verified",
                data: verifyData,
            });
        } else {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Enter Valid OTP",
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

module.exports.resendEmailOtp = async (request, response, next) => {
    try {
        let { email, type } = request.body;
        if (type && type == "ALL") {
            // const checkResendStatus = await twillio.reSendOtpInEmail(email);
            // if (!checkResendStatus) {
            //     return response.status(500).json({
            //         status: true,
            //         message: "Error While Send OTP",
            //         data: [],
            //     });
            // }
            return response.status(200).json({
                STATUSCODE: 200,
                status: true,
                message: "Verification Code sent To Email",
                data: [],
            });
        } else {
            // check if user is exists
            const checkUser = await Users.findOne({
                email: email,
                isDeleted: false,
            });

            if (!checkUser) {
                return response.status(404).json({
                    STATUSCODE: 404,
                    status: false,
                    message: "User Not Found",
                    data: null,
                });
            }
            // const checkResendStatus = await twillio.reSendOtpInEmail(email);
            // if (!checkResendStatus) {
            //     return response.status(500).json({
            //         status: true,
            //         message: "Error While Send OTP",
            //         data: [],
            //     });
            // }
            return response.status(200).json({
                STATUSCODE: 200,
                status: true,
                message: "Verification Code sent To Email",
                data: [],
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

module.exports.verifyMobileOtp = async (request, response, next) => {
    try {
        const { mobile, code } = request.body;

        // const verifyData = await twillio.verifyOtp(mobile, code);
        const verifyData = code == 123123 ? "approved" : "rejected";

        if (verifyData == "approved") {
            return response.status(200).json({
                STATUSCODE: 200,
                status: true,
                message: "mobile verified",
                data: verifyData,
            });
        } else {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Enter Valid OTP",
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

module.exports.resendMobileOtp = async (request, response, next) => {
    try {
        let { mobile } = request.body;
        // const checkResendStatus = await twillio.reSendOtpInMobile(mobile);
        // if (!checkResendStatus) {
        //     return response.status(500).json({
        //         status: true,
        //         message: "Error While Send OTP",
        //         data: [],
        //     });
        // }
        return response.status(200).json({
            STATUSCODE: 200,
            status: true,
            message: "Verification Code sent To Mobile",
            data: [],
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

module.exports.changePassword = async (request, response, next) => {
    try {
        const { oldPassword, password, user } = request.body;

        const userData = await Users.findById(user._id).select("+password");
        if (!userData) {
            return response.status(200).json({
                STATUSCODE: 404,               
                status: false,
                message: "User Not Found",
                data: null,
            });
        }
        const checkPassword = await bcrypt.compare(
            oldPassword,
            userData.password,
        );
        if (!checkPassword) {
            return response.status(200).json({
                STATUSCODE: 422,               
                status: false,
                message: "Your Old Password Not Match",
                data: null,
            });
        }
        const passwordSalt = await bcrypt.genSalt(saltRounds);
        const pass = await bcrypt.hash(password, passwordSalt);
        const updateUserData = await Users.findOneAndUpdate(
            { _id: user._id },
            { $set: { password: pass } },
            { new: true },
        );
        if (!updateUserData) {
            return response.status(200).json({
                STATUSCODE: 400,               
                status: false,
                message: "Error While Update Your Password",
                data: null,
            });
        }
        return response.status(200).json({
            STATUSCODE: 200,
            status: true,
            message: "Password Changed",
            data: [],
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

module.exports.forgotPassword = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        const passwordSalt = await bcrypt.genSalt(saltRounds);
        const pass = await bcrypt.hash(password, passwordSalt);
        const updateUserData = await Users.findOneAndUpdate(
            { email: email },
            { $set: { password: pass } },
            { new: true },
        );
        if (!updateUserData) {
            return response.status(200).json({
                STATUSCODE: 400,               
                status: false,
                message: "Error While Update Your Password",
                data: null,
            });
        }
        return response.status(200).json({
            STATUSCODE: 200,
            status: true,
            message: "Password Changed",
            data: [],
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
