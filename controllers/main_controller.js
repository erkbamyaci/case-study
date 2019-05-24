module.exports = {

    /**
     * @apiVersion 1.0.0
     * @api {post} api/v1/records Fetch records
     * @apiName FetchRecords
     * @apiGroup Record
     * @apiDescription Fetch records according to request payload.
     *
     *
     * @apiParam {string} startDate earliest date of the record (YYYY-MM-DD)
     * @apiParam {string} endDate latest date of the record (YYYY-MM-DD)
     * @apiParam {string} minCount minimum total of counts array
     * @apiParam {string} maxCount maximum total of counts array
     *
     * @apiSuccess {number} code Success Code 0
     * @apiSuccess {string} msg Success Message
     * @apiSuccess {array} records List of Records
     *
     * @apiError {number} code Success Code 1
     * @apiError {string} msg Error Message
     * @apiError {string} error Reason of Error
     *
     * @apiSuccessExample {json} Success-Response:
     *  {
     *      "code":0,
     *      "msg":"Success",
     *      "records":[
     *          {
     *              "key":"TAKwGc6Jr4i8Z487",
     *              "createdAt":"2017-01-28T01:22:14.398Z",
     *              "totalCount":2800
     *          },
     *          {
     *              "key":"NAeQ8eX7e5TEg7oH",
     *              "createdAt":"2017-01-27T08:19:14.135Z",
     *              "totalCount":2900
     *          }
     *      ]
     *  }
     *
     * @apiSampleRequest api/v1/records
     *
     * @apiParamExample {json} Request-Example:
     *  {
     *      "startDate": "2016-01-26",
     *      "endDate": "2018-02-02",
     *      "minCount": 2700,
     *      "maxCount": 3000
     *  }
     */

    records: async (req, res, next) => {

        const {db} = req;
        // get request payload
        const {startDate, endDate, minCount, maxCount} = req.body;
        // get records collection
        const collection = db.collection("records");

        try {

            // get records according to request payload with desired fields and write into an array
            const records = await collection.aggregate([
                {
                    $match: {
                        $and: [
                            {createdAt: {$lte: new Date(endDate)}},
                            {createdAt: {$gte: new Date(startDate)}},
                            {$expr: {$gte: [{$sum: "$counts"}, minCount]}},
                            {$expr: {$lte: [{$sum: "$counts"}, maxCount]}}
                        ]
                    }
                },
                {
                    $project: {
                        _id: 0,
                        key: "$key",
                        createdAt: "$createdAt",
                        totalCount: {$sum: "$counts"}
                    }
                }
            ]).toArray();

            // prepare the response to be sent
            const result = {};
            result.code = 0;
            result.msg = "Success";
            result.records = records;

            // send response with status code 200 and move to next middleware
            res.status(200).send(result);
            next();
        }
        catch (err) {

            console.log(err);

            // prepare error response
            const result = {};
            result.code = 1;
            result.msg = "Error";
            result.error = "failed to fetch records (route: /records)";

            // send error response with status code 500 and move to next middleware
            res.status(500).send(result);
            next();
        }
    }
};
