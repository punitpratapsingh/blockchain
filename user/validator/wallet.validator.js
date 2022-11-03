const Joi = require("joi");

module.exports.checkWallet = (request, response, next) => {
    let rules = Joi.object().keys({
        type: Joi.string().valid("ethereum").required(),
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

module.exports.swapWallet = (request, response, next) => {
    let rules = Joi.object().keys({
        type: Joi.string().valid("BGT", "BGUSD").required(),
        amount: Joi.number().required(),
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

module.exports.transferWallet = (request, response, next) => {
    let rules = Joi.object().keys({
        toUserId: Joi.string().required(),
        amount: Joi.number().required(),
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

module.exports.withdraw = (request, response, next) => {
    let rules = Joi.object().keys({
        address: Joi.string().required(),
        amount: Joi.number().required(),
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

module.exports.getUserWalletTransactions = (request, response, next) => {
    let rules = Joi.object().keys({
        page: Joi.number().required(),
        sizePerPage: Joi.number().required(),
        chain: Joi.string(),
        type: Joi.string(),
        status: Joi.string(),
    });
    const { error } = rules.validate(request.query);
    if (error) {
        return response
            .status(200)
            .json({ status: false, message: error, data: null });
    } else {
        next();
    }
};
