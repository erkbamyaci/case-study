const users_controller = require("../controllers/main_controller");
const connectToDB = require("../utils/middlewares").connectToDB;
const disconnectFromDB = require("../utils/middlewares").disconnectFromDB;

module.exports = (router) => {

    // get records according to request payload
    router.route("/records")
        .post(connectToDB, users_controller.records, disconnectFromDB);
};
