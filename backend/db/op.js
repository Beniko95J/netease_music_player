const bPromise = require('bluebird');
const mysql = require('promise-mysql');
const config = require('./config');
const sqls = require('./sql');
const md5 = require('md5');

const pool = mysql.createPool(config.mysql);

helperFunc = {};

module.exports = {
  addUser: function(params, res) {
    result = {};
    const username = params.username;
    const password = params.password;
    pool.then(p => p.getConnection()).then((connection) => {
      connection.query(sqls.queryUserByName, [username]).then((data) => {
        if (data.length !== 0) {
          return new bPromise((resolve, reject) => {reject('用户名已存在');});
        }
        else {
          return connection;
        }
      }).then((connection) => {
        connection.query(sqls.insert, [username, md5(password)]).then((data) => {
          result = {
            data: data,
            code: 200,
            msg: "注册成功"};
          res.json(result);
        }).catch((err) => {
          console.log(err);
          result = {
            data: null,
            code: 400,
            msg: "操作失败"};
          res.json(result);
        })
      }).catch(err => {
        console.log(err);
        result = {
          data: null,
          code: 200,
          msg: "用户名已存在"};
        res.json(result);
      })
    }).catch((err) => {
      console.log(err);
      result = {
        data: null,
        code: 400,
        msg: "操作失败"};
      res.json(result);
    });
  },
  queryAllUser: function(params, res) {
    result = {};
    pool.then(p => p.getConnection()).then((connection) => {
      connection.query(sqls.queryAll).then((data) => {
        result = {
          data: data,
          code: 200,
          msg: "注册成功"};
        res.json(result);
      }).catch((err) => {
        console.log(err);
        result = {
          data: null,
          code: 400,
          msg: "操作失败"};
        res.json(result);
      })
    }).catch((err) => {
      console.log(err);
      result = {
        data: null,
        code: 400,
        msg: "操作失败"};
      res.json(result);
    });
  },
  authenticateUser: function(params, res) {

  }
}
