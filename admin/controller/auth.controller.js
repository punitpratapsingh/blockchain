const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/users.model");
const config = require("../../config/config");
const saltRounds = 10;

module.exports.register = async (request, response, next) => {
    try {
        const { name, email, password } = request.body;

        // check if user is exists
        const checkUser = await Admin.findOne({
            email: email,
            role: "ADMIN",
            isDeleted: false,
        });
        if (checkUser) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "Your Email Is Already Registered",
                data: null,
            });
        }

        //GENERATING PASSWORD
        const passwordSalt = await bcrypt.genSalt(saltRounds);
        const pass = await bcrypt.hash(password, passwordSalt);

        //CREATING USER IN MONGODB

        newUsers = await Admin.create({
            name,
            email,
            role: "ADMIN",
            password: pass,
        });

        //jwt token
        const token = jwt.sign(JSON.stringify(newUsers), config.JWT_AUTH_TOKEN);
        const sendData = { userData: newUsers, token: token };

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "Admin Register successfully",
            data: sendData,
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

module.exports.login = async (request, response, next) => {
    try {
        const { email, password } = request.body;

        const userData = await Admin.findOne({
            email: email,
            role: "ADMIN",
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
STATUSCODE: 200,               
 status: false,
                message: "Password Is Not Match",
                data: null,
            });
        }

        const token = jwt.sign(JSON.stringify(userData), config.JWT_AUTH_TOKEN);
        const sendData = { userData, token: token };

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "Login successfully",
            data: sendData,
        });
    } catch (e) {
        console.log(
            "%c 🍨 e: ",
            "font-size:20px;background-color: #465975;color:#fff;",
            e,
        );
        return response.status(200).json({
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.changePassword = async (request, response, next) => {
    try {
        const { oldPassword, password, user } = request.body;

        const userData = await Admin.findById(user._id).select("+password");
        if (!userData) {
            return response.status(200).json({
STATUSCODE: 200,               
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
STATUSCODE: 200,               
 status: false,
                message: "Your Old Password Not Match",
                data: null,
            });
        }
        const passwordSalt = await bcrypt.genSalt(saltRounds);
        const pass = await bcrypt.hash(password, passwordSalt);
        const updateUserData = await Admin.findOneAndUpdate(
            { _id: user._id },
            { $set: { password: pass } },
            { new: true },
        );
        if (!updateUserData) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "Error While Update Your Password",
                data: null,
            });
        }
        return response.status(200).json({
            status: true,
            message: "Password Changed",
            data: [],
        });
    } catch (e) {
        return response.status(200).json({
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};
