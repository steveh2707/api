const express = require('express')
const router = express.Router();
const connection = require('../db')

router.get('/collections/:collectionid', (req, res) => {

  let c_id = req.params.collectionid

  let sql = `
  SELECT collection_id, collection_name, collection_creation_date, collection_last_edit_date, collection.user_id, user_name 
    FROM collection
    LEFT JOIN user on collection.user_id=user.user_id  
    WHERE collection_id=?;
  SELECT album.album_id, album_num, album_name, release_year, cover_image_url, link_url, record_label_name, genre_name FROM collection_album
    LEFT JOIN album on collection_album.album_id=album.album_id
    LEFT JOIN record_label on album.record_label_id=record_label.record_label_id
    LEFT JOIN genre on album.primary_genre_id=genre.genre_id
    WHERE collection_id =?
    ORDER BY album_num;
  SELECT album_id, artist.artist_id, artist_name 
    FROM album_artist
    LEFT JOIN artist on album_artist.artist_id=artist.artist_id
  `

  connection.query(sql, [c_id, c_id], (err, response) => {
    if (err) {
      res.json(err)
    } else {

      try {
        let collectiondetails = response[0][0]
        let albums = response[1]
        let artists = response[2]

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

        res.json(collectiondetails)
      } catch {
        res.json({ message: "collection does not exist" })
      }
    }
  })
})

module.exports = router;