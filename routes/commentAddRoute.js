const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler


router.post('/addcomment/:collection_id', (req, res) => {

  let c_id = req.params.collection_id;
  let comment_message = req.body.comment_message
  let user_id = req.body.user_id
  const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');


  let sql = `
  INSERT INTO comment (comment_id, comment_message, comment_date_time, collection_id, user_id) 
  VALUES (NULL, ?, ?, ?, ?)
      `

  connection.query(sql, [comment_message, currentDateTime, c_id, user_id], (err, response) => {

    if (err) return res.json(errorHandler("Database connection error", err));

    res.json(dataHandler("Comment successfully added"))
  })

})

module.exports = router;