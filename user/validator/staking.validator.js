const Joi = require("joi");

module.exports.addStaking = (request, response, next) => {
    let rules = Joi.object().keys({
        plan: Joi.number().required(),
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
