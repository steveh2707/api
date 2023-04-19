const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler

router.get('/collections', (req, res) => {

  let frontEndPageNum = parseInt(req.query.page)
  let sort = req.query.sort

  let mySQLPageNum = frontEndPageNum - 1;

  let resultsPerPage = 12;

  let pagestart = mySQLPageNum * resultsPerPage;
  let pageend = pagestart + resultsPerPage;

  let sortSQL = "collection_last_edit_date"
  if (sort === "likes") sortSQL = "likes"
  if (sort === "comments") sortSQL = "comments"

  let sql = `
  SELECT collection.collection_id, collection_name, collection_creation_date, collection_last_edit_date, collection.user_id, user_name,
	  (SELECT COUNT(*) FROM likes WHERE likes.collection_id=collection.collection_id) as likes,
    (SELECT COUNT(*) FROM comment WHERE comment.collection_id=collection.collection_id) as comments
    FROM collection
    LEFT JOIN user on collection.user_id=user.user_id  
    ORDER BY ${sortSQL} DESC
    LIMIT ?,?;
  SELECT collection_id, cover_image_url FROM collection_album
    INNER JOIN album on collection_album.album_id=album.album_id
    ORDER BY album_num;
  SELECT COUNT(*) AS count FROM collection;
  `

  connection.query(sql, [pagestart, pageend], (err, response) => {
    if (err) {
      res.json(errorHandler("Database connection error", err));
    } else {
      let collections = response[0]
      let albums = response[1]
      let count = response[2]

      // add albums to collections array
      collections.forEach(collection => {

        collection.albumImages = [];

        // add images to albums array
        let loop = 0;
        albums.forEach(album => {
          if (collection.collection_id == album.collection_id && loop < 4) {
            collection.albumImages.push(album.cover_image_url)
            loop++;
          }
        })
      })

      let dataPacket = dataHandler("Successfully loaded collections", collections)
      dataPacket.page = frontEndPageNum;
      dataPacket.totalResults = count[0].count
      dataPacket.totalPages = Math.ceil(dataPacket.totalResults / resultsPerPage)

      res.json(dataPacket)
    }

  })
})

module.exports = router;