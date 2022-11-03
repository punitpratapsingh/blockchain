const Joi = require("joi");

const { fileValidation } = require("../../helpers/file.validation");

module.exports.updateUser = (request, response, next) => {
    let rules = Joi.object().keys({
        email: Joi.string().required(),
        userName: Joi.string().required(),
        name: Joi.string().required(),
        isEmailVerified: Joi.boolean().required(),
        allowReferral: Joi.boolean().required(),
    });
    const { error } = rules.validate(request.body);
    if (error) {
        return response
            .status(200)
            .json({ status: false, message: error, data: null });
    } else {
        if (request.files && request.files.profileImage) {
            const { profileImage } = request.files;

            const imageValidation = fileValidation(profileImage);

            if (imageValidation.status === false) {
                return response.status(200).json({
                    status: false,
                    message: imageValidation.message,
                    data: null,
                });
            }
        }
        next();
    }
};

module.exports.getUserList = (request, response, next) => {
    let rules = Joi.object().keys({
        page: Joi.number().required(),
        sizePerPage: Joi.number().required(),
        search: Joi.string(),
        kycStatue: Joi.string(),
        startDate: Joi.date(),
        endDate: Joi.date(),
    });
    const { error } = rules.validate(request.query);
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

module.exports.updateUserKyc = (request, response, next) => {
    let rules = Joi.object().keys({
        status: Joi.string()
            .required()
            .valid("APPROVED", "PENDING", "REJECTED", "IN-PROCESS"),
    });
    const { error } = rules.validate(request.body);
    if (error) {
        return response
            .status(200)
            .json({ status: false, message: error, data: null });
    } else {
        next();
    }
};

module.exports.updateUserReferral = (request, response, next) => {
    let rules = Joi.object().keys({
        fromUser: Joi.string().required(),
    });
    const { error } = rules.validate(request.body);
    if (error) {
        return response
            .status(200)
            .json({ status: false, message: error, data: null });
    } else {
        next();
    }
};
