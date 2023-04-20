const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler

router.get('/artists/:artistid', (req, res) => {

  let a_id = req.params.artistid

  let sql = `
  SELECT *
    FROM artist
    WHERE artist_id = ?;
  SELECT album.album_id, album_name, release_year, cover_image_url 
    FROM album_artist
    LEFT JOIN album on album_artist.album_id=album.album_id
    WHERE artist_id=?;
  `

  connection.query(sql, [a_id, a_id], (err, response) => {
    if (err) return res.json(errorHandler("Database connection error", err));

    try {
      let artistdetails = response[0][0]
      let albums = response[1]

      artistdetails.albums = []
      albums.forEach(album => {
        artistdetails.albums.push(album)
      })

      res.json(dataHandler("Successfully loaded artist", artistdetails))
    } catch {
      res.json(errorHandler("Artist does not exist", err));
    }

  })
})

module.exports = router;