const express = require('express')
const router = express.Router();
const connection = require('../db')


router.post('/reordercollection/:collectionid', (req, res) => {

  // let c_id = req.params.collectionid

  // check body contains all required variables
  // if (!req.body.apiKey) return errorHandler("API key missing");
  // if (!req.body.userID) return errorHandler("userID missing");
  // if (!req.body.collectionName) return errorHandler("collectionName missing");
  // if (!req.body.albumIDArray) return errorHandler("albumIDArray missing");

  let collectionAlbumID = req.body.collectionAlbumID;
  let albumNumEnd = req.body.albumNumEnd;

  console.log(collectionAlbumID)
  console.log(albumNumEnd)

  let sql = `
  UPDATE collection_album SET album_num = ? WHERE collection_album.collection_album_id = ?
  `

  connection.query(sql, [albumNumEnd, collectionAlbumID], (err, response) => {

    if (err) {
      res.json(err)
    } else {
      if (response.changedRows === 0) {
        res.json({
          success: false,
          message: response.message
        })
      } else {
        res.json({
          success: true,
          message: "album num successfully changed",
        })
      }
    }
  })

})

module.exports = router;