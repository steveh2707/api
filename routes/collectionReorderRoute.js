const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler

router.post('/reordercollection/:collectionid', (req, res) => {

  let c_id = req.params.collectionid
  let collectionAlbumID = req.body.collectionAlbumID;
  let albumNumEnd = req.body.albumNumEnd;
  let userID = req.body.userID;

  let checkUserSql = `SELECT user_id FROM collection WHERE collection_id=?;`

  let updateSql = `
  UPDATE collection_album SET album_num = ? WHERE collection_album.collection_album_id = ?
  `

  connection.query(checkUserSql, [c_id], (err1, response1) => {
    if (err1) return res.json(errorHandler("Database connection error", err1));

    if (response1[0].user_id != userID) return res.json(errorHandler("Wrong user"));

    connection.query(updateSql, [albumNumEnd, collectionAlbumID], (err2, response2) => {
      if (err2) return res.json(errorHandler("Database connection error", err2));

      if (response2.changedRows === 0) return res.json(errorHandler("No rows changed", response2.message));

      res.json(dataHandler("Album numbers successfully changed"))
    })
  })
})

module.exports = router;