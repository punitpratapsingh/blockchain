const { CHAIN } = require("../config/config");
const axios = require("axios");

module.exports.getTxDataData = (chain, address, startBlock, userId) => {
    return new Promise(async (resolve) => {
        switch (chain) {
            case "BSC":
                return axios
                    .get(
                        `${
                            CHAIN[chain].SCAN_URL
                        }/api?module=account&action=tokentx&address=${
                            CHAIN[chain].ADMIN_ADDRESS
                        }&contractaddress=${
                            CHAIN[chain].TOKEN_ADDRESS
                        }&startblock=${
                            startBlock == 0
                                ? startBlock
                                : parseInt(parseInt(startBlock) + 1)
                        }&endblock=${
                            CHAIN[chain].END_BLOCK
                        }&page=1&offset=50&sort=asc&apikey=${
                            CHAIN[chain].SCAN_API_KEY
                        }`,
                    )
                    .then(async function (response) {
                        let sendData = [],
                            amount = 0;
                        response.data.result.forEach((element) => {
                            if (
                                element.from.toLowerCase() ==
                                address.toLowerCase()
                            ) {
                                sendData.push({
                                    user: userId,
                                    chain: "BSC",
                                    type: "DEPOSIT",
                                    address: element.contractAddress,
                                    fromAddress: element.from,
                                    toAddress: element.to,
                                    blockNumber: element.blockNumber,
                                    txhash: element.hash,
                                    quantity: parseFloat(
                                        Number(element.value) /
                                            Number(10 ** element.tokenDecimal),
                                    ),
                                    amount: parseFloat(
                                        Number(element.value) /
                                            Number(10 ** element.tokenDecimal),
                                    ),
                                    time: element.timeStamp,
                                    status: 1,
                                });
                                amount += parseFloat(
                                    Number(element.value) /
                                        Number(10 ** element.tokenDecimal),
                                );
                            }
                        });
                        resolve({ data: sendData, amount: amount });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            case "RINKEBY":
                return axios
                    .get(
                        `${
                            CHAIN[chain].SCAN_URL
                        }/api?module=account&action=tokentx&address=${
                            CHAIN[chain].ADMIN_ADDRESS
                        }&contractaddress=${
                            CHAIN[chain].TOKEN_ADDRESS
                        }&startblock=${
                            startBlock == 0
                                ? startBlock
                                : parseInt(parseInt(startBlock) + 1)
                        }&endblock=${
                            CHAIN[chain].END_BLOCK
                        }&page=1&offset=50&sort=asc&apikey=${
                            CHAIN[chain].SCAN_API_KEY
                        }`,
                    )
                    .then(function (response) {
                        let sendData = [],
                            amount = 0;
                        response.data.result.forEach((element) => {
                            if (
                                element.from.toLowerCase() ==
                                address.toLowerCase()
                            ) {
                                sendData.push({
                                    user: userId,
                                    chain: "RINKEBY",
                                    type: "DEPOSIT",
                                    address: element.contractAddress,
                                    fromAddress: element.from,
                                    toAddress: element.to,
                                    blockNumber: element.blockNumber,
                                    txhash: element.hash,
                                    quantity: parseFloat(
                                        Number(element.value) /
                                            Number(10 ** element.tokenDecimal),
                                    ),
                                    amount: parseFloat(
                                        Number(element.value) /
                                            Number(10 ** element.tokenDecimal),
                                    ),
                                    time: element.timeStamp,
                                    status: 1,
                                });
                                amount += parseFloat(
                                    Number(element.value) /
                                        Number(10 ** element.tokenDecimal),
                                );
                            }
                        });
                        resolve({ data: sendData, amount: amount });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
        }
    });
};
