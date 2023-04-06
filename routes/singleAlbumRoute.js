const express = require('express')
const router = express.Router();
const connection = require('../db')

router.get('/albums/:albumid', (req, res) => {

  let a_id = req.params.albumid

  let sql = `
  SELECT *
    FROM album
    LEFT JOIN record_label on album.record_label_id=record_label.record_label_id
    LEFT JOIN genre on album.primary_genre_id=genre.genre_id
    WHERE album_id = ?;
  SELECT artist.artist_id, artist_name 
    FROM album_artist
    LEFT JOIN artist on album_artist.artist_id=artist.artist_id
    WHERE album_id=?;
  SELECT genre.genre_id, genre_name 
    FROM album_subgenre
    LEFT JOIN genre on album_subgenre.genre_id=genre.genre_id
    WHERE album_id=?;
  SELECT track_id, track_name 
    FROM track
    WHERE album_id=?;
  SELECT collection.collection_id, collection_name
    FROM collection_album
    LEFT JOIN collection on collection_album.collection_id=collection.collection_id
    WHERE album_id = ?
  `

  connection.query(sql, [a_id, a_id, a_id, a_id, a_id], (err, response) => {
    if (err) {
      res.json(err)
    } else {

      try {
        let albumdetails = response[0][0]
        let artists = response[1]
        let subgenres = response[2]
        let tracks = response[3]
        let collections = response[4]

        albumdetails.artists = []
        artists.forEach(artist => {
          albumdetails.artists.push(artist)
        })

        albumdetails.subgenres = []
        subgenres.forEach(genre => {
          albumdetails.subgenres.push(genre)
        })

        albumdetails.tracks = []
        tracks.forEach(album => {
          albumdetails.tracks.push(album)
        })

        albumdetails.collections = []
        collections.forEach(collection => {
          albumdetails.collections.push(collection)
        })

        res.json(albumdetails)
      } catch {
        res.json({ message: "collection does not exist" })
      }
    }
  })
})

module.exports = router;