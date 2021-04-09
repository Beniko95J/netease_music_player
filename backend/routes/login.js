const express = require('express')
const ops = require('../db/op');

const router = express.Router();

router.post('/login', function(req, res, next) {
  console.log('calling login api...')
  console.log(req.body);
  res.json({
    msg: 'login api called'
  });
})

module.exports = router;