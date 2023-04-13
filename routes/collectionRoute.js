const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler

router.get('/collections/:collectionid', (req, res) => {

  let c_id = req.params.collectionid

  let sql = `
  SELECT collection_id, collection_name, collection_creation_date, collection_last_edit_date, collection.user_id, user_name 
    FROM collection
    LEFT JOIN user on collection.user_id=user.user_id  
    WHERE collection_id=?;
  SELECT album.album_id, collection_album_id, album_num, album_name, release_year, cover_image_url, link_url, record_label_name, genre_name FROM collection_album
    LEFT JOIN album on collection_album.album_id=album.album_id
    LEFT JOIN record_label on album.record_label_id=record_label.record_label_id
    LEFT JOIN genre on album.primary_genre_id=genre.genre_id
    WHERE collection_id =?
    ORDER BY album_num;
  SELECT album_id, artist.artist_id, artist_name 
    FROM album_artist
    LEFT JOIN artist on album_artist.artist_id=artist.artist_id;
  SELECT comment_id, comment_message, comment_date_time, comment.user_id, user_name
    FROM comment
    LEFT JOIN user on comment.user_id=user.user_id
    WHERE collection_id=?
    ORDER BY comment_date_time DESC;
  `

  connection.query(sql, [c_id, c_id, c_id], (err, response) => {
    if (err) return res.json(errorHandler("Database connection error", err));

    try {
      let collectiondetails = response[0][0]
      let albums = response[1]
      let artists = response[2]
      let comments = response[3]

      collectiondetails.albums = []
      albums.forEach(album => {
        collectiondetails.albums.push(album)
        album.albumArtists = []

        artists.forEach(artist => {
          if (artist.album_id == album.album_id) {
            album.albumArtists.push({
              artist_id: artist.artist_id,
              artist_name: artist.artist_name
            })
          }
        })
      })

      collectiondetails.comments = []
      comments.forEach(comment => {
        collectiondetails.comments.push(comment)
      })

      res.json(dataHandler("Successfully loaded collection", collectiondetails))

    } catch {
      res.json(errorHandler("Collection does not exist", err));
    }

  })
})

module.exports = router;