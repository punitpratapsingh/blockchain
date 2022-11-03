const Joi = require("joi");

module.exports.register = async (request, response, next) => {
    let rules = Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
        name: Joi.string().required(),
        country: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        houseNo: Joi.string().required(),
        zipcode: Joi.string().required(),
        mobile: Joi.string().required(),
        referral: Joi.string(),
        fromUserView: Joi.string(),
    });
    const { error } = rules.validate(request.body);
    if (error) {
        return response
            .status(200)
            .json({ status: false, message: error, data: null });
    } else {
        return next();
    }
};

module.exports.login = async (request, response, next) => {
    let rules = Joi.object().keys({
        userName: Joi.string().required(),
        password: Joi.string().required(),
    });

    const { error } = rules.validate(request.body);
    if (error) {
        return response
            .status(200)
            .json({ status: false, message: error, data: null });
    } else {
        return next();
    }
};

module.exports.verifyEmail = async (request, response, next) => {
    let rules = Joi.object().keys({
        code: Joi.number().required(),
    });
    const { error } = rules.validate(request.body);
    if (error) {
        return response
            .status(200)
            .json({ status: false, message: error, data: null });
    } else {
        return next();
    }
};

module.exports.verifyMobile = async (request, response, next) => {
    let rules = Joi.object().keys({
        code: Joi.number().required(),
        mobile: Joi.required(),
    });
    const { error } = rules.validate(request.body);
    if (error) {
        return response
            .status(200)
            .json({ status: false, message: error, data: null });
    } else {
        return next();
    }
};

module.exports.resendMobileOtp = async (request, response, next) => {
    let rules = Joi.object().keys({
        mobile: Joi.required(),
    });
    const { error } = rules.validate(request.body);
    if (error) {
        return response
            .status(200)
            .json({ status: false, message: error, data: null });
    } else {
        return next();
    }
};

module.exports.resendEmailVerification = async (request, response, next) => {
    let rules = Joi.object().keys({
        email: Joi.string().required(),
        type: Joi.string(),
    });
    const { error } = rules.validate(request.body);
    if (error) {
        return response
            .status(200)
            .json({ status: false, message: error, data: null });
    } else {
        return next();
    }
};

module.exports.resendEmailOtp = async (request, response, next) => {
    let rules = Joi.object().keys({
        email: Joi.string().required(),
    });
    const { error } = rules.validate(request.body);
    if (error) {
        return response
            .status(200)
            .json({ status: false, message: error, data: null });
    } else {
        return next();
    }
};

module.exports.changePassword = async (request, response, next) => {
    let rules = Joi.object().keys({
        oldPassword: Joi.string().required(),
        password: Joi.string().required(),
    });
    const { error } = rules.validate(request.body);
    if (error) {
        return response
            .status(200)
            .json({ status: false, message: error, data: null });
    } else {
        return next();
    }
};

module.exports.verifyAuthenticator = async (request, response, next) => {
    let rules = Joi.object().keys({
        code: Joi.string().required(),
    });
    const { error } = rules.validate(request.body);
    if (error) {
        return response
            .status(200)
            .json({ status: false, message: error, data: null });
    } else {
        return next();
    }
};
