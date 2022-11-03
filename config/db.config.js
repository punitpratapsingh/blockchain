const config = require("./config");
const mongoose = require("mongoose");

const connectDb = mongoose.connect(
    config.DATABASE,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    },
    (err) => {
        if (err) {
            console.log("Connection to Database failed.");
        } else {
            console.log("Database connection successful.");
        }
    },
);

const database = mongoose.connection;

database.on("error", console.error.bind(console, "MongoDB connection error"));

module.exports = connectDb;
