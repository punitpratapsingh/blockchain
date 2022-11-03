const Joi = require("joi");

module.exports.getTransactions = (request, response, next) => {
    let rules = Joi.object().keys({
        page: Joi.number().required(),
        sizePerPage: Joi.number().required(),
        chain: Joi.string(),
        type: Joi.string(),
        status: Joi.string(),
        userId: Joi.string(),
        fromUserId: Joi.string(),
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

module.exports.updateWithdrawTransaction = (request, response, next) => {
    let rules = Joi.object().keys({
        status: Joi.number().required(),
        txHash: Joi.string(),
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
