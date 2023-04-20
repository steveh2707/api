const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler

router.get('/albums', (req, res) => {

  let sql = `
  SELECT album_id, album_name, release_year, cover_image_url, link_url, record_label_name, genre_name
    FROM album
    LEFT JOIN record_label on album.record_label_id=record_label.record_label_id
    LEFT JOIN genre on album.primary_genre_id=genre.genre_id;
  SELECT album_id, artist.artist_id, artist_name 
    FROM album_artist
    LEFT JOIN artist on album_artist.artist_id=artist.artist_id;
  SELECT album_id, genre.genre_id, genre_name
    FROM album_subgenre
    LEFT JOIN genre on album_subgenre.genre_id=genre.genre_id;
  `

  connection.query(sql, (err, response) => {
    if (err) return res.json(errorHandler("Database connection error", err));

    let albumdetails = response[0];
    let artists = response[1];
    let subgenres = response[2];

    albumdetails.forEach(album => {

      album.albumArtists = [];
      artists.forEach(artist => {
        if (artist.album_id == album.album_id) {
          album.albumArtists.push({
            artist_id: artist.artist_id,
            artist_name: artist.artist_name
          })
        }
      })

      album.subGenres = [];
      subgenres.forEach(genre => {
        if (genre.album_id == album.album_id) {
          album.subGenres.push({
            genre_id: genre.genre_id,
            genre_name: genre.genre_name
          })
        }
      })
    })

    res.json(dataHandler("Successfully loaded albums", albumdetails))
  })
})


module.exports = router;