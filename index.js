require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();

const environment = process.env.NODE_ENV; // development
const stage = require("./config")[environment];

const routes = require("./routes/index");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

if (environment !== "production") {
    app.use(logger("dev"));
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST');
    next();
});

app.use("/api/v1", routes(router));

const server = app.listen(stage && stage.port || 7000, () => {
    console.log(`Server now listening at localhost: ${stage && stage.port || 7000}`);
});

module.exports = server;
