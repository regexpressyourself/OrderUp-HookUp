var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/nope', function(req, res, next) {
  res.render('nope');
});

module.exports = router;
