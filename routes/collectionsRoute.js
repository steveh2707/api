const express = require('express')
const router = express.Router();
const connection = require('../db')

router.get('/collections', (req, res) => {

  let page = req.query.page || 0;

  let resultsPerPage = 12;

  let pagestart = page * resultsPerPage;
  let pageend = pagestart + resultsPerPage;

  let sql = `
  SELECT collection_id, collection_name, collection_creation_date, collection_last_edit_date, collection.user_id, user_name 
    FROM collection
    LEFT JOIN user on collection.user_id=user.user_id  
    ORDER BY collection_last_edit_date DESC
    LIMIT ?, ?;
  SELECT collection_id, cover_image_url FROM collection_album
    INNER JOIN album on collection_album.album_id=album.album_id
    ORDER BY album_num;
  `

  connection.query(sql, [pagestart, pageend], (err, response) => {
    if (err) {
      res.json(err)
    } else {
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

      res.json(collections)
    }

  })
})

module.exports = router;