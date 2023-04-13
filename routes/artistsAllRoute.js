const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler

router.get('/artists', (req, res) => {

  let sql1 = `
  SELECT *
    FROM artist;
  SELECT album.album_id, artist_id, album_name, release_year, cover_image_url 
    FROM album_artist 
    LEFT JOIN album on album_artist.album_id=album.album_id
  `

  connection.query(sql1, (err, response) => {
    if (err) return res.json(errorHandler("Database connection error", err));

    let artists = response[0]
    let albums = response[1]

    artists.forEach(artist => {
      artist.albums = []

      albums.forEach(album => {
        if (artist.artist_id == album.artist_id) {
          artist.albums.push({
            album_id: album.album_id,
            album_name: album.album_name,
            release_year: album.release_year,
            cover_image_url: album.cover_image_url,
          })
        }
      })

    })

    res.json(dataHandler("Successfully loaded Artists", artists))

  })
})


module.exports = router;