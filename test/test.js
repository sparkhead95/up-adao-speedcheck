// Normally, I would make a separate test file for each component, but the project isn't big here so I see no need.

const assert = require('assert');
const sinon = require('sinon');
const nock = require('nock');
const _ = require('lodash');
const apiController = require('../controllers/apiController');

const googleSpeedCheckUrl = 'https://www.googleapis.com';

describe('Api Controller', function () {
    nock.disableNetConnect();

    let req = {
        body: {
            urls: "https://www.google.com"
        }
    };

    let res = {
        send: sinon.stub(),
        json: function (err) {
            console.log("\n : " + err);
        },
        status: sinon.stub()
    };

    let speedCheckResult1 = {
        title: 'Speedcheck1',
        responseCode: 200,
        ruleGroups: {
            SPEED: {
                score: 98
            }
        },
        id: req.body.urls[ 0 ]
    };

    let expectedResponse = {
        sites: [
            {
                title: speedCheckResult1.title,
                response_code: speedCheckResult1.responseCode,
                speed_score: speedCheckResult1.ruleGroups.SPEED.score,
                url: speedCheckResult1.id
            }
        ]
    };

    res.status.returns(res);

    beforeEach(function () {
        res.status.returns(res);
    });

    afterEach(function () {
        res.status.reset();
        res.send.reset();
    });

    it('responds with speed check result in valid format', function (done) {
        nock(googleSpeedCheckUrl)
            .get('/pagespeedonline/v4/runPagespeed')
            .query(true)
            .reply(200, speedCheckResult1);

        apiController(req, res, null, () => {
            assert(res.send.calledOnce);
            assert(res.send.calledWith(expectedResponse));
            done();
        });
    });

    it('responds with error code 500 if there was a server error', function (done) {
        nock(googleSpeedCheckUrl)
            .get('/pagespeedonline/v4/runPagespeed')
            .query(true)
            .reply(500, new Error('There was an error'));

        apiController(req, res, null, () => {
            assert(res.send.calledOnce);
            assert(res.status.calledWith(500));
            done();
        });
    });

    it('returns 400 when url was not properly passed in', function () {
        nock(googleSpeedCheckUrl)
            .get('/pagespeedonline/v4/runPagespeed')
            .query(true)
            .reply(200, speedCheckResult1);

        req.body.urls = 4;
        apiController(req, res, null, () => {
            assert(res.status.calledWith(400));
        });
    });

    it('returns 400 when url was not passed in at all', function () {
        nock(googleSpeedCheckUrl)
            .get('/pagespeedonline/v4/runPagespeed')
            .query(true)
            .reply(200, speedCheckResult1);

        req.body.urls = null;
        apiController(req, res, null, () => {
            assert(res.status.calledWith(400));
        });
    });

    it('accepts an array of urls instead of string', function (done) {
        nock(googleSpeedCheckUrl)
            .get('/pagespeedonline/v4/runPagespeed')
            .times(3)
            .query(true)
            .reply(200, speedCheckResult1);

        expectedResponse.sites.push(expectedResponse.sites[0]);
        expectedResponse.sites.push(expectedResponse.sites[0]);

        req.body.urls = ["www.google.com", "www.twitter.com", "www.test.com"];

        apiController(req, res, null, () => {
            assert(res.send.calledOnce);
            assert(res.send.calledWith(expectedResponse));
            done();
        });
    });
});