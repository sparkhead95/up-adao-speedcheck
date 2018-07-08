let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pagespeed-Backend' });
});

/* POST home. */
router.post('/', function(req, res, next) {
    res.send('Nothing here! POST to /api if you wish to use Speed Check functionalities.')
});

module.exports = router;
