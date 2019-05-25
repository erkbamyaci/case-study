const MongoClient = require("mongodb");

module.exports = {

    // connect to database
    connectToDB: async (req, res, next) => {

        const connUri = process.env.MONGO_LOCAL_CONN_URL;

        try {

            // connect to database
            const client = await MongoClient.connect(connUri, {useNewUrlParser: true});
            // Add db and client to req
            req.client = client;
            req.db = client.db("getir-case-study");

            // Move to next middlware
            next();
        }
        catch (err) {

            console.log(err);

            // prepare error response
            const result = {};
            result.code = 2;
            result.msg = "Error";
            result.error = "cannot connect to database";

            // send error response with status code 500
            res.status(500).send(result);
        }
    },

    // disconnect from database
    disconnectFromDB: async (req) => {

        try {

            const {client} = req;

            // disconnect from database
            client.close();
        }
        catch (err) {
            console.log(err);
        }
    }
};
