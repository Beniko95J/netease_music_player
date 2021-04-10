var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  if (req.session.userinfo) {
    console.log('I am here.');
    res.send('你好，' + req.session.userinfo + '，欢迎回来');
  }
  else {
    req.session.userinfo = "张三";
    res.send("未登录");
  }
});

module.exports = router;
