const MongoClient = require("mongodb");

module.exports = {

    connectToDB: async (req, res, next) => {

        const connUri = process.env.MONGO_LOCAL_CONN_URL;

        try {

            // Add db to req
            const client = await MongoClient.connect(connUri, {useNewUrlParser: true});
            req.client = client;
            req.db = client.db("getir-case-study");

            // Move to next middlware
            next();
        }
        catch (err) {
            console.log(err);
        }
    },

    disconnectFromDB: async (req) => {

        try {

            const {client} = req;

            client.close();
        }
        catch (err) {
            console.log(err);
        }
    }
};
