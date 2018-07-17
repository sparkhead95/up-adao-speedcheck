const rp = require('request-promise');
const _ = require('lodash');
const noop = () => {
};

const googleSpeedCheckUrl = 'https://www.googleapis.com/pagespeedonline/v4/runPagespeed';
const googleApiKey = 'AIzaSyCU16wC-50rZn9awSvSNJLQHt_eEslIyAc';

// This function is called by the express router on /api post requests. It validates the request and does speed checks if all is good.
// I left the 'next' function in there in case the next route was needed at a later stage.
// I know the testCallback is a bit of an awkward way to test asynchronous functions in this file,
// but I didn't see it as much of a problem
function handleApiRequest(req, res, next, testCallback = noop) {
    if (!validBody(req)) {
        res.status(400).send('Invalid URL format. \'urls\' variable must be string or array.');
        testCallback();
    } else {
        speedCheckLinks(req.body.urls, (err, response) => {
            if (err) {
                res.status(err.statusCode).send(err.message);
                testCallback();
            } else {
                res.status(200).send(response);
                testCallback();
            }
        });
    }
}

// Checks the url in the body of the request to check if it's string or array
function validBody(req) {
    let valid = false;
    let body = req.body;

    if (body.urls) {
        if ((_.isString(body.urls)) || (_.isArray(body.urls))) {
            valid = true;
        }
    }

    return valid;
}

function speedCheckLinks(urlArray, cb) {
    if (!_.isArray(urlArray)) urlArray = [urlArray]; // Convert string to array using lodash array check

    let response = {
        sites: []
    };

    let speedCheckPromises = urlArray.map(url => {
        // For every url in the list of urls provided in the request, do a speed check and return them all once done
        if (!url.includes('http')) url = 'http://' + url;

        let options = {
            uri: googleSpeedCheckUrl,
            qs: {url, key: googleApiKey},
            json: true
        };

        return rp(options);
    });

    Promise.all(speedCheckPromises).then((results => {
        console.log(results.length);

        _.forEach(results, result => {
            response.sites.push({
                title: result.title,
                response_code: result.responseCode,
                speed_score: result.ruleGroups.SPEED.score,
                url: result.id
            });
        });

        cb(null, response);
    })).catch(err => {
        cb(err);
    });
}

module.exports = handleApiRequest;