const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler

router.post('/deletecollection/:collectionid', (req, res) => {

  let c_id = req.params.collectionid
  let userID = req.body.userID;

  let checkUserSql = `SELECT user_id FROM collection WHERE collection_id=?;`

  let deleteSQL = `
  DELETE FROM collection_album where collection_id=?;
  DELETE FROM comment where collection_id=?;
  DELETE FROM collection where collection_id=?;
  `

  connection.query(checkUserSql, [userID], (err, response) => {
    if (err) return res.json(errorHandler("Database connection error", err));

    if (!response.user_id == userID) return res.json(errorHandler("Wrong user", err));

    connection.query(deleteSQL, [c_id, c_id, c_id], (err, response) => {
      if (err) return res.json(errorHandler("Database connection error", err));

      res.json(dataHandler("Collection deleted"))
    })
  })
})

module.exports = router;