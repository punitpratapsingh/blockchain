const SupportModel = require("../../models/support.model");
const path = require("path");

module.exports.updateSupport = async (request, response, next) => {
    try {
        const { id } = request.params;
        const { status, adminReplay } = request.body;

        const updateSupportStatus = await SupportModel.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $set: { status, adminReplay },
            },
            {
                $new: true,
            },
        );

        if (!updateSupportStatus) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "Error While Get Support",
                data: null,
            });
        }
        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "Support Get successfully",
            data: updateSupportStatus,
        });
    } catch (e) {
        return response.status(200).json({
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.deleteSupport = async (request, response, next) => {
    try {
        const { id } = request.params;
        const { user } = request.body;

        const deleteSupport = await SupportModel.findOneAndUpdate(
            { _id: id, user: user._id },
            {
                $set: { isDeleted: true },
            },
            {
                new: true,
            },
        );

        if (!deleteSupport) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "Error While Delete Support ",
                data: null,
            });
        }

        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "Support Deleted successfully",
            data: deleteSupport,
        });
    } catch (e) {
        return response.status(200).json({
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.getSupportList = async (request, response, next) => {
    try {
        const { page, sizePerPage, type, startDate, endDate, status } =
            request.query;
        const { user } = request.body;
        const options = {
            page,
            limit: sizePerPage,
            sort: { createdAt: -1 },
            populate: {
                path: "user",
                select: "userName name email profileImage",
            },
        };
        let query = { isDeleted: false, user: user._id };
        if (type) {
            query.type = type;
        }
        if (status) {
            query.status = status;
        }
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else {
            if (startDate) {
                query.createdAt = { $gte: new Date(startDate) };
            }
            if (endDate) {
                query.createdAt = { $lte: new Date(endDate) };
            }
        }

        const getSupportList = await SupportModel.paginate(query, options);

        if (!getSupportList) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "Error While Get Support List",
                data: null,
            });
        }
        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "Support List Get successfully",
            data: getSupportList,
        });
    } catch (e) {
        return response.status(200).json({
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.getSupport = async (request, response, next) => {
    try {
        const { id } = request.params;

        const getSupportList = await SupportModel.findOne({
            _id: id,
        });

        if (!getSupportList) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "Error While Get Support",
                data: null,
            });
        }
        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "Support Get successfully",
            data: getSupportList,
        });
    } catch (e) {
        return response.status(200).json({
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.adminMessage = async (request, response, next) => {
    try {
        const { id } = request.params;
        const { message } = request.body;

        const updateSupportMessage = await SupportModel.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $push: {
                    thread: { message },
                },
            },
            {
                $new: true,
            },
        );
        if (!updateSupportMessage) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "Error while sending message",
                data: null,
            });
        }
        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "Message sent Successfully",
            data: message,
        });
    } catch (e) {
        return response.status(200).json({
            status: false,
            message: "Something went Wrong",
            data: null,
        });
    }
};
