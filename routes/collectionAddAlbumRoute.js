const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler


router.post('/collectionAddAlbum', (req, res) => {

  let collection_id = req.body.collectionID;
  let album_id = req.body.albumID;
  let user_id = req.body.userID;

  let checkUserSql = `SELECT user_id FROM collection WHERE collection_id=?;`

  let sqlcheckAlbumNums = `
    SELECT album_num from collection_album WHERE collection_id=?
  `

  connection.query(checkUserSql, [collection_id], (err, response) => {
    if (err) return res.json(errorHandler("Database connection error", err));

    if (response[0].user_id != user_id) return res.json(errorHandler("Wrong user"));

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

        let updateLastEditDateSql = `UPDATE collection SET collection_last_edit_date = ? WHERE collection_id = ?;`
        let currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        connection.query(updateLastEditDateSql, [currentDateTime, collection_id], (err, response) => {
          if (err) return res.json(errorHandler("Database connection error", err));
          res.json(dataHandler("Album successfully added"))
        })
      })
    })
  })

})

module.exports = router;