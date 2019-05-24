module.exports = {

    records: async (req, res, next) => {

        const {db} = req;
        const {startDate, endDate, minCount, maxCount} = req.body;
        const collection = db.collection("records");

        try {

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

            const result = {};
            result.code = 0;
            result.msg = "Success";
            result.records = records;

            res.status(200).send(result);
            next();
        }
        catch (err) {

            console.log(err);

            const result = {};
            result.code = 1;
            result.msg = "Error";
            result.error = "failed to fetch records (route: /records)";

            res.status(500).send(result);
            next();
        }
    }
};
