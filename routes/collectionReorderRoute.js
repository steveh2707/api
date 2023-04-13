const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler

router.post('/reordercollection/:collectionid', (req, res) => {

  let collectionAlbumID = req.body.collectionAlbumID;
  let albumNumEnd = req.body.albumNumEnd;

  let sql = `
  UPDATE collection_album SET album_num = ? WHERE collection_album.collection_album_id = ?
  `

  connection.query(sql, [albumNumEnd, collectionAlbumID], (err, response) => {

    if (err) return res.json(errorHandler("Database connection error", err));

    if (response.changedRows === 0) return res.json(errorHandler("Database connection error", response.message));

    res.json(dataHandler("Album numbers successfully changed"))
  })

})

module.exports = router;