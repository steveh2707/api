const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler


router.post('/addAlbumToCollection', (req, res) => {

  let collection_id = req.body.collectionID;
  let album_id = req.body.albumID;

  console.log(collection_id)
  console.log(album_id)

  let sqlcheckAlbumNums = `
    SELECT album_num from collection_album WHERE collection_id=?
  `
  connection.query(sqlcheckAlbumNums, [collection_id,], (err, response) => {
    if (err) return res.json(errorHandler("Database connection error", err));

    let max = 0;
    response.forEach(album => {
      if (album.album_num > max) max = album.album_num
    })

    let sqlAddAlbum = `
    INSERT INTO collection_album (collection_album_id, album_num, collection_id, album_id)
    VALUES (NULL, ?, ?, ?)
    `
    connection.query(sqlAddAlbum, [++max, collection_id, album_id], (err, response) => {
      if (err) return res.json(errorHandler("Database connection error", err));
      res.json(dataHandler("Album successfully added"))
    })
  })


})

module.exports = router;