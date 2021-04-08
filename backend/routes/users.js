var express = require('express');
var router = express.Router();

var mysql = require('mysql');
const { connect } = require('../app');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/Usersql');

var pool = mysql.createPool(dbConfig.mysql);
var responseJSON = function(res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '400',
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
}

router.post('/reg', function(req, res, next) {
  console.log(req.query);
  console.log(req.params);
  console.log(req.body.username);
  pool.getConnection((err, connection) => {
    if (err !== null) {
      console.log(err);
    }
    else {
      var _res = res;
      connection.query(userSQL.queryAll, (err, res) => {
        console.log(res);
      })
    }
  });
  res.json({msg: 'received'});
})

router.get('/reg', function(req, res, next) {
  res.send('reg api');
})

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.send('respond with a resource');

});

module.exports = router;
