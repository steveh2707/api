const express = require('express')
const router = express.Router();
const connection = require('../db')


router.post('/reordercollection/:collectionid', (req, res) => {

  let C_id = req.params.collectionid

  // check body contains all required variables
  // if (!req.body.apiKey) return errorHandler("API key missing");
  // if (!req.body.userID) return errorHandler("userID missing");
  // if (!req.body.collectionName) return errorHandler("collectionName missing");
  // if (!req.body.albumIDArray) return errorHandler("albumIDArray missing");

  let albumNumStart = req.body.albumNumStart;
  let albumNumEnd = req.body.albumNumEnd;
  // let album_ids = req.body.albumIDArray
  // let api_key = req.body.apiKey
  // const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  console.log(C_id)
  console.log(albumNumStart)
  console.log(albumNumEnd)

})

module.exports = router;