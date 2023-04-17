const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler

router.post('/collectionDeleteAlbum', (req, res) => {

  let c_id = req.body.collectionID
  let albumID = req.body.albumID
  let userID = req.body.userID

  let checkUserSql = `SELECT user_id FROM collection WHERE collection_id=?;`

  let deleteSql = `
  DELETE FROM collection_album WHERE collection_id=? AND album_id=?;
  `

  connection.query(checkUserSql, [c_id], (err, response) => {
    if (err) return res.json(errorHandler("Database connection error", err));

    if (response[0].user_id != userID) return res.json(errorHandler("Wrong user"));

    connection.query(deleteSql, [c_id, albumID], (err, response) => {
      if (err) return res.json(errorHandler("Database connection error", err));

      let updateLastEditDateSql = `UPDATE collection SET collection_last_edit_date = ? WHERE collection_id = ?;`
      let currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

      connection.query(updateLastEditDateSql, [currentDateTime, c_id], (err, response) => {
        if (err) return res.json(errorHandler("Database connection error", err));
        res.json(dataHandler("Album Deleted"))
      })
    })
  })
})

module.exports = router;