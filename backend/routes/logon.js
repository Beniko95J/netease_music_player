const express = require('express');
const ops = require('../db/op');

const router = express.Router();

router.post('/logon', function(req, res, next) {
  console.log('calling logon api...')
  console.log(req.body);

  const params = req.body;

  ops.addUser(params, res);
})

module.exports = router;
