const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler

router.get('/search', (req, res) => {

  let search_term = "%" + req.query.value + "%"


  let sql = `
  SELECT * FROM collection WHERE collection_name LIKE ?;
  SELECT * FROM album WHERE album_name LIKE ?;
  SELECT * FROM artist WHERE artist_name LIKE ?;
  SELECT * FROM user WHERE user_name LIKE ?;
  `

  connection.query(sql, [search_term, search_term, search_term, search_term], (err, response) => {
    if (err) return res.json(errorHandler("Database connection error", err));

    try {

      let data = {}
      let count = 0;

      data.collections = response[0]
      count += data.collections.length
      data.albums = response[1]
      count += data.albums.length
      data.artists = response[2]
      count += data.artists.length
      data.users = response[3]
      count += data.users.length

      let jsonResponse = dataHandler("Found results", data)
      jsonResponse.numResults = count

      res.json(jsonResponse)

    } catch {
      res.json(errorHandler("Collection does not exist", err));
    }

  })
})

module.exports = router;