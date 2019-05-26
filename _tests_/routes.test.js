const server = require('../index');
const Axios = require("axios");

// extension to check if a Number is between given Numbers
expect.extend({

    toBeInRange(number, min, max) {

        const pass = number >= min && number <= max;

        return {
            pass
        }
    }
});

// extension to check if a date is between given dates
expect.extend({

    dateBetween(date, min, max) {

        const pass = new Date(date) >= new Date(min) && new Date(date) <= new Date(max);

        return {
            pass
        }
    }
});

beforeAll(async () => {
    // console.log before anything else runs
    console.log('Jest starting!');
});

afterAll(() => {

    // close the server after all tests are finished and console.log
    server.close();
    console.log('server closed!');
});

describe('basic route tests', () => {

    test('fetch records POST /records', async () => {

        // sample payload for test
        const payload = {
            startDate: "2016-10-26",
            endDate: "2016-10-27",
            minCount: 2700,
            maxCount: 3000
        };

        try {

            // send request for testing purpose
            const response = await Axios({
                url: "http://3.120.140.136:7000/api/v1/records",
                data: payload,
                method: "POST",
                headers: {
                    "Accept-Language": "tr"
                },
            });

            expect(response.status).toEqual(200); // check if status is 200
            expect(response.data.code).toEqual(0); // check if response code is 0
            expect(response.data.records).toEqual(expect.arrayContaining([ // check if records is an array
                expect.objectContaining({ // check if records array consist of objects
                    key: expect.any(String), // check if key in object is a String
                    createdAt: expect.dateBetween(payload.startDate, payload.endDate), // check if created at is a Date and it is between given dates
                    totalCount: expect.toBeInRange(payload.minCount, payload.maxCount) // check if total count is a Number and it is between given amounts
                })
            ]));
        }
        catch (err) {
            console.log(err);
        }
    });
});
