require("dotenv").config();

const config = {
    PORT: 8080, //process.env.PORT,
    DATABASE: process.env.DATABASE_URL,
    JWT_AUTH_TOKEN: process.env.JWT_AUTH_TOKEN,
    SALT_ROUND: process.env.SALT_ROUND,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    CLIENT_ID: process.env.CLIENT_ID,
    TDA_CALL_BACK_URL: process.env.TDA_CALL_BACK_URL,
    FRONT_END_URL: "http://localhost:3000/",

    GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
    GCP_BUCKET_NAME: process.env.GCP_BUCKET_NAME,

    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_SERVICE_ID: process.env.TWILIO_SERVICE_ID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,

    AWS_S3_ACCESSKEYID: process.env.AWS_S3_ACCESSKEYID,
    AWS_S3_SECRETKEY: process.env.AWS_S3_SECRETKEY,
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,

    BGT_PRICE: 0.25,

    CHAIN: {
        RINKEBY: {
            WALLET_URL:
                "https://rinkeby.infura.io/v3/bc00870f8acd437f81ffdcf8b3b3c966",
            ADMIN_ADDRESS: "0xfcdfdcfe80a371d6b366c7cf60e1bf25e454f3cd",
            TOKEN_ADDRESS: "0x783b5af21fd4e99cf98ebe469a2f63dcfde6c738",
            SCAN_URL: "https://api-rinkeby.etherscan.io/",
            SCAN_API_KEY: "1HURYHP63RWG6BA1K976H8PC1TNC37NIUH",
            END_BLOCK: 9999999999,
        },
        BSC_TEST: {
            WALLET_URL: "https://data-seed-prebsc-1-s1.binance.org:8545", // binance base Url
            ADMIN_ADDRESS: "0xB5AB4255cf3BBaFA5d2f2886d707604918E4D4Bf", // admin address in binance smart chain
            TOKEN_ADDRESS: "0x689EE599FE87C8Cb79E6BC987fc2E2bD9F2269E8", // BEP20 token address
            SCAN_URL: "https://api-testnet.bscscan.com/",
            SCAN_API_KEY: "2CXMI5XKQUGVYXMF9MA37I4JQ5U4PW5DYY",
            END_BLOCK: 9999999999, // check tx for end block
        },
        BSC: {
            WALLET_URL: "https://bsc-dataseed.binance.org/", // binance base Url
            ADMIN_ADDRESS: "0x3AFC73E995A751bCF7AB041Cf24C0d9b9a270241", // admin address in binance smart chain
            TOKEN_ADDRESS1: "0x55d398326f99059ff775485246999027b3197955", // BEP20 token address
            TOKEN_ADDRESS2: "0xe9e7cea3dedca5984780bafc599bd69add087d56", // BEP20 token address
            SCAN_URL: "https://api.bscscan.com/",
            SCAN_API_KEY: "5K18QX2QY372SSMUE1UA55P3T6DN7SKB74",
            END_BLOCK: 9999999999, // check tx for end block
        },
    },
};

module.exports = config;
