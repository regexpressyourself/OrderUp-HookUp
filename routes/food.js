var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/food', function(req, res, next) {
  res.render('food', { data: yelp_data });
});

module.exports = router;
