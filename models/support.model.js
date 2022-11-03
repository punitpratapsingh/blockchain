const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");
require("@mongoosejs/double");

const ThreadSchema = new Schema({
    message: {
        type: String,
    },
    reply: [
        {
            message: {
                type: String,
            },
        },
    ],
});

const Support = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        desc: {
            type: String,
        },
        adminReplay: {
            type: String,
        },
        title: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["completed", "pending", "rejected", "cancelled"],
            required: true,
            default: "pending",
        },
        thread: [ThreadSchema],
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

Support.plugin(mongoosePaginate);

module.exports = mongoose.models.Support || mongoose.model("Support", Support);
