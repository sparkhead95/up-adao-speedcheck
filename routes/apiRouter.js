const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

/* POST api requests. With a bigger API, this would be specific (e.g /api/speedcheck),
but in this case any route can be accepted as there is only one endpoint*/
router.post('*', apiController);

module.exports = router;
