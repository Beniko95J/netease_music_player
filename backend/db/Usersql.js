var UserSQL = {
  insert: 'INSERT INTO m_user(username, id) VALUES(?,?)',
  queryAll: 'SELECT * FROM m_user'
};

module.exports = UserSQL;
