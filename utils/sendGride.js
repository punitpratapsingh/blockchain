const sgMail = require("@sendgrid/mail");
const config = require("../config/config");
sgMail.setApiKey(config.SENDGRID_API_KEY);

module.exports.sendRegEmail = (email, code) => {
    return new Promise((resolve) => {
        const msg = {
            to: email,
            from: "harshad@roundtechsquare.com",
            subject: "Verification",
            html: `Your verification code is : ${code}`,
        };
        sgMail.send(msg).then(
            () => {
                resolve(true);
            },
            (error) => {
                resolve(true);
                if (error.response) {
                    console.error(error.response.body);
                }
            },
        );
    });
};

module.exports.sendTestEmail = (data) => {
    return new Promise((resolve) => {
        const msg = {
            to: "krishaadeshara02@gmail.com",
            from: "harshad@roundtechsquare.com",
            subject: "Verification",
            html: `${data}`,
        };
        sgMail.send(msg).then(
            () => {
                resolve(true);
            },
            (error) => {
                resolve(true);
                if (error.response) {
                    console.error(error.response.body);
                }
            },
        );
    });
};
