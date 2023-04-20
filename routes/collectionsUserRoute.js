const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler

router.get('/users/:userid', (req, res) => {

  let u_id = req.params.userid

  let sql = `
  SELECT collection_id, collection_name, collection_creation_date, collection_last_edit_date, collection.user_id, user_name,
    (SELECT COUNT(*) FROM likes WHERE likes.collection_id=collection.collection_id) as likes,
    (SELECT COUNT(*) FROM comment WHERE comment.collection_id=collection.collection_id) as comments 
    FROM collection
    LEFT JOIN user on collection.user_id=user.user_id  
    WHERE collection.user_id=?
    ORDER BY collection_last_edit_date DESC;
  SELECT collection_id, cover_image_url FROM collection_album
    INNER JOIN album on collection_album.album_id=album.album_id
    ORDER BY album_num;
  SELECT user_name FROM user where user_id=?;
  `

  connection.query(sql, [u_id, u_id], (err, response) => {
    if (err) return res.json(errorHandler("Database connection error", err));

    let collections = response[0]
    let albums = response[1]

    // add albums to collections array
    collections.forEach(collection => {

      collection.albumImages = [];

      // add artists to albums array
      albums.forEach(album => {
        if (collection.collection_id == album.collection_id) {
          collection.albumImages.push(album.cover_image_url)
        }
      })
    })

    let responseJson = dataHandler("Successfully loaded collections", collections)

    responseJson.user = {
      user_id: u_id,
      user_name: response[2][0].user_name
    }

    res.json(responseJson)
  })
})

module.exports = router;