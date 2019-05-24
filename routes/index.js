const records = require("./records");

module.exports = (router) => {

    records(router);

    return router;
};
