const request = require('supertest');
const server = require('../index');
const Axios = require("axios");

expect.extend({
    toBeInRange(number, min, max) {
        const pass = number >= min && number <= max;
        return {
            pass
        }
    }
});

expect.extend({
    dateBetween(date, min, max) {
        const pass = new Date(date) >= new Date(min) && new Date(date) <= new Date(max);
        return {
            pass
        }
    }
})

beforeAll(async () => {
    // do something before anything else runs
    console.log('Jest starting!');
});

afterAll(() => {
    // close the server after each test
    server.close();
    console.log('server closed!');
});

describe('basic route tests', () => {
    test('fetch records POST /records', async () => {

        const payload = {
            startDate: "2016-10-26",
            endDate: "2016-10-27",
            minCount: 2700,
            maxCount: 3000
        };

        try {

            const response = await Axios({
                url: "http://localhost:7000/api/v1/records",
                data: payload,
                method: "POST",
                headers: {
                    "Accept-Language": "tr"
                },
            });

            expect(response.status).toEqual(200);
            expect(response.data.code).toEqual(0);
            expect(response.data.records).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    key: expect.any(String),
                    createdAt: expect.dateBetween(payload.startDate, payload.endDate),
                    totalCount: expect.toBeInRange(payload.minCount, payload.maxCount)
                })
            ]));
        }
        catch (err) {
            console.log(err);
        }
    });
});
