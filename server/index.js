const express = require('express');

const app = express();

app.use(require('cors')());
app.use(express.json());

require('./plugins/db')(app);
require('./route/route')(app);

app.listen(3000, () => {
  console.log('Hello, world!');
});
