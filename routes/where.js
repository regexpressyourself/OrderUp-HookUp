var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/where', function(req, res, next) {
  res.render('where');
});

module.exports = router;
