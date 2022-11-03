const express = require("express");

const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");
var fs = require('fs');
const serverless = require("serverless-http");
const config = require("./config/config");
require("./config/db.config");
const router = require("./router");
const fireblocksFun = require("./fireblock/index");

var credentials = {
    key: fs.readFileSync('/etc/letsencrypt/live/client.exo-wallet.com/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/client.exo-wallet.com/fullchain.pem', 'utf8')
};

const app = express();

var server = require('https').createServer(credentials, app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

app.use(express.static(__dirname + "public"));
app.use(express.static(path.resolve(__dirname, "./public")));

app.use("/", router);

app.get('/test', async (req, res) => {
    // const vaultAccounts = await fireblocks.getVaultAccounts()
    // console.log("%c 🍕 vaultAccounts", "color:#3f7cff", vaultAccounts);
    res.status(200);
    res.json({ success: true, message: "Server running" });
})

app.get('/test1', fireblocksFun.getVault)


//custom 404 page
app.use(function (req, res) {
    res.type("text/plain");
    res.status(404);
    res.send({ success: false, message: "404 Not Found" });
});

app.use(function (err, req, res, next) {
    res.type("text/plain");
    res.status(500);
    res.json({ success: false, message: "500 Server Error", data: err.stack });
    next(err);
});

// module.exports.serverless = serverless(app);

server.listen(config.PORT, () => {
    console.log(`App running on http://localhost:${config.PORT}`);
});
