const config = require("../config/config");
const client = require("twilio")(
    config.TWILIO_ACCOUNT_SID,
    config.TWILIO_AUTH_TOKEN,
);

module.exports.sendOtpInMobile = async (mobile) => {
    const verification = await client.verify
        .services(config.TWILIO_SERVICE_ID)
        .verifications.create({ to: mobile, channel: "sms" })
        .then((verification) => {
            return verification;
        })
        .catch((err) => console.log(err));
    return verification;
};

module.exports.reSendOtpInMobile = async (mobile) => {
    return new Promise(async (resolve) => {
        await client.verify
            .services(config.TWILIO_SERVICE_ID)
            .verifications.create({ to: mobile, channel: "sms" })
            .then((verification) => {
                console.log(
                    "%c 🍩 verification",
                    "color:#fca650",
                    verification,
                );
                resolve(true);
            })
            .catch((err) => {
                console.log("%c 🥤 err", "color:#4fff4B", err);
                resolve(false);
            });
    });
};

module.exports.sendOtpInEmail = async (email) => {
    await client.verify
        .services(config.TWILIO_SERVICE_ID)
        .verifications.create({ to: email, channel: "email" })
        .then((verification) => {
            console.log("%c 🥚 verification", "color:#3f7cff", verification);
            return verification;
        })
        .catch((err) => {
            console.log("%c 🍧 err", "color:#2eafb0", err);
            console.log(err);
        });
};

module.exports.reSendOtpInEmail = async (email) => {
    return new Promise(async (resolve) => {
        await client.verify
            .services(config.TWILIO_SERVICE_ID)
            .verifications.create({ to: email, channel: "email" })
            .then((verification) => {
                resolve(true);
            })
            .catch((err) => {
                console.log("%c 🍐 err", "color:#3f7cff", err);
                resolve(false);
            });
    });
};

module.exports.verifyOtp = async (data, code) => {
    return new Promise(async (resolve) => {
        await client.verify
            .services(config.TWILIO_SERVICE_ID)
            .verificationChecks.create({
                to: data,
                code: code,
            })
            .then((verification_check) => {
                resolve(verification_check.status);
            })
            .catch((err) => {
                console.log(err);
                resolve(false);
            });
    });
};
