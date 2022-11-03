var config = require("../config/config");
const AWS = require("aws-sdk");
//AWS.config.setPromisesDependency();
AWS.config.update({
    accessKeyId: config.AWS_S3_ACCESSKEYID,
    secretAccessKey: config.AWS_S3_SECRETKEY,
    region: config.AWS_S3_REGION,
});
const fs = require("fs");

module.exports.uploadFileToS3 = async (fileNameAWS, contentType, element) => {
    return new Promise((resolve) => {
        // var awsKey = path + fileNameAWS;
        const s3 = new AWS.S3();
        const fileContent = Buffer.from(element.data, "binary");

        // Setting up S3 upload parameters
        const params = {
            Bucket: config.AWS_S3_BUCKET,
            Key: fileNameAWS, // File name you want to save as in S3
            Body: fileContent,
            ACL: "public-read",
            ContentType: contentType,
        };

        // Uploading files to the bucket
        s3.upload(params, function (err, data) {
            if (err) {
                console.log(err);
                return resolve({
                    status: false,
                    message: "error while uploading image on s3.",
                });
            }
            console.log(data);
            return resolve({ status: true, data: data });
        });
    });
};

module.exports.deletePost = async (fileNameAWS) => {
    return new Promise((resolve) => {
        var awsKey = "post/" + fileNameAWS;
        const s3 = new AWS.S3();

        // Setting up S3 upload parameters
        const params = {
            Bucket: config.AWS_S3_BUCKET,
            Key: awsKey, // File name you want to save as in S3
        };

        // Uploading files to the bucket
        s3.deleteObject(params, function (err, data) {
            if (err) {
                console.log(err);
                return resolve({
                    status: false,
                    message: "Error while deleting image on s3.",
                });
            }
            console.log(data);
            return resolve({ status: true, data: data });
        });
    });
};
