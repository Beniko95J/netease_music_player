var sqls = {
  insert: 'INSERT INTO m_user(username, password) VALUES(?,?)',
  queryAll: 'SELECT * FROM m_user',
  queryUserByName: 'SELECT * FROM m_user WHERE username=?',
  queryPasswordByName: 'SELECT password FROM m_user WHERE username=?'
};

module.exports = sqls;
