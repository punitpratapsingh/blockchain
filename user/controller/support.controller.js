const SupportModel = require("../../models/support.model.js");
const path = require("path");
const { uploadFileToS3 } = require("../../utils/awsS3");

module.exports.addSupport = async (request, response, next) => {
    try {
        const { user, desc, type, title } = request.body;

        let insertData;

        if (request.files && request.files.image) {
            const { image } = request.files;

            const fileName = `support-image/${new Date().getTime()}${path.extname(
                image.name,
            )}`;

            const Uploaded = await uploadFileToS3(
                fileName,
                image.mimetype,
                image,
            );
            if (Uploaded === false) {
                return response.status(200).json({
                    status: false,
                    message: "Error While add Image",
                    data: null,
                });
            }

            insertData = {
                user: user._id,
                desc,
                type,
                image: fileName,
                title,
            };
        } else {
            insertData = {
                user: user._id,
                desc,
                type,
                title,
            };
        }

        const addNewSupport = await SupportModel.create(insertData);

        if (!addNewSupport) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "Error While Add Support",
                data: null,
            });
        }
        return response.json({
            STATUSCODE: 200,
            status: true,
            message: "Support Add successfully",
            data: addNewSupport,
        });
    } catch (e) {
        console.log(
            "%c 🥧 e: ",
            "font-size:20px;background-color: #3F7CFF;color:#fff;",
            e,
        );
        return response.status(500).json({
STATUSCODE: 500,
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
            message: "Support Delete successfully",
            data: deleteSupport,
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

module.exports.getSupportList = async (request, response, next) => {
    try {
        const { page, sizePerPage, type, startDate, endDate, status } =
            request.query;
        const { user } = request.body;
        const options = {
            page,
            limit: sizePerPage,
            sort: { createdAt: 1 },
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
        return response.status(500).json({
STATUSCODE: 500,
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
                message: "Error While Get Feedback",
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
        return response.status(500).json({
STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.updateSupport = async (request, response, next) => {
    try {
        const { id } = request.params;
        const { status } = request.body;

        const updateSupportStatus = await SupportModel.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $set: { status },
            },
            {
                $new: true,
            },
        );

        if (!updateSupportStatus) {
            return response.status(200).json({
STATUSCODE: 200,               
 status: false,
                message: "Error While Get Feedback",
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
        return response.status(500).json({
STATUSCODE: 500,
            status: false,
            message: "Something Went To Wrong",
            data: null,
        });
    }
};

module.exports.userMessage = async (request, response, next) => {
    try {
        const { id } = request.params;
        const { message } = request.body;

        const updateUserMessage = SupportModel.thread.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $push: {
                    reply: {
                        message,
                    },
                },
            },
            {
                new: true,
            },
        );
        if (!updateUserMessage) {
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
        console.log(e);
        return response.status(500).json({
STATUSCODE: 500,
            status: false,
            message: "Something went Wrong",
            data: null,
        });
    }
};
