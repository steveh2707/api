const express = require('express')
const router = express.Router();
const connection = require('../db')

router.get('/collections', (req, res) => {

  let page = req.query.page || 1;

  let resultsPerPage = 12;

  let pagestart = (page - 1) * resultsPerPage + 1;
  let pageend = pagestart + resultsPerPage - 1;

  let sql = `
  SELECT collection_id, collection_name, collection_creation_date, collection_last_edit_date, collection.user_id, user_name 
    FROM collection
    LEFT JOIN user on collection.user_id=user.user_id  
    WHERE collection_id BETWEEN ? AND ?
    ORDER BY collection_last_edit_date DESC;
  SELECT collection_id, cover_image_url, album_num FROM collection_album
    INNER JOIN album on collection_album.album_id=album.album_id
    WHERE collection_id BETWEEN ? AND ?
    ORDER BY album_num;
  `

  connection.query(sql, [pagestart, pageend, pagestart, pageend], (err, response) => {
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