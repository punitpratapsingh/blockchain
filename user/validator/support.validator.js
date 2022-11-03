const Joi = require("joi");

module.exports.addSupport = (request, response, next) => {
    let rules = Joi.object().keys({
        desc: Joi.string(),
        type: Joi.required(),
        title: Joi.required(),
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

module.exports.getSupportList = (request, response, next) => {
    let rules = Joi.object().keys({
        page: Joi.number().required(),
        sizePerPage: Joi.number().required(),
        type: Joi.string(),
        status: Joi.string().valid(
            "completed",
            "pending",
            "rejected",
            "cancelled",
        ),
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

module.exports.updateSupport = (request, response, next) => {
    let rules = Joi.object().keys({
        status: Joi.string()
            .required()
            .valid("completed", "pending", "rejected", "cancelled"),
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
