const Joi = require("joi");

const { fileValidation } = require("../../helpers/file.validation");

module.exports.updateUser = (request, response, next) => {
    let rules = Joi.object().keys({
        name: Joi.string().required(),
        country: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        houseNo: Joi.string().required(),
        zipcode: Joi.string().required(),
        userName: Joi.string().required(),
        vaultId: Joi.string().required(),
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

module.exports.addUserKyc = (request, response, next) => {
    let rules = Joi.object().keys({
        mobile: Joi.string().required(),
        documentType: Joi.string().required(),
        documentName: Joi.string().required(),
        documentNumber: Joi.string().required(),
    });
    const { error } = rules.validate(request.body);
    if (error) {
        return response
            .status(200)
            .json({ status: false, message: error, data: null });
    } else {
        if (request.files && request.files.documentImage) {
            const { documentImage } = request.files;

            const imageValidation = fileValidation(documentImage);

            if (imageValidation.status === false) {
                return response.status(200).json({
                    status: false,
                    message: imageValidation.message,
                    data: null,
                });
            }
            next();
        } else {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "documentImage is required",
                data: null,
            });
        }
    }
};

module.exports.addUserAddress = (request, response, next) => {
    let rules = Joi.object().keys({
        address: Joi.required(),
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
