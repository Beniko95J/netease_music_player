module.exports = app => {
  const express = require('express');
  const router = express.Router();
  const Song = require('../models/Song');

  router.post('/add', async (req, res) => {
    console.log(req.body);
    const model = await Song.create(req.body);
    res.send(model);
  })

  router.get('/list', async (req, res) => {
    const items = await Song.find().limit(30);
    res.send(items);
  })

  router.delete('/delete/:id', async (req, res) => {
    await Song.deleteMany({songId: req.params.id});
    res.send({
      success: true
    })
  })

  app.use('/api', router);
}