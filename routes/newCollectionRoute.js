const express = require('express')
const router = express.Router();
const connection = require('../db')


router.post('/addcollection', (req, res) => {

  errorHandler = (err) => {
    res.json({
      success: false,
      message: "Unsuccessful",
      error: err
    })
  }

  // check body contains all required variables
  if (!req.body.apiKey) return errorHandler("API key missing");
  if (!req.body.userID) return errorHandler("userID missing");
  if (!req.body.collectionName) return errorHandler("collectionName missing");
  if (!req.body.albumIDArray) return errorHandler("albumIDArray missing");

  let user_id = req.body.userID;
  let collection_name = req.body.collectionName;
  let album_ids = req.body.albumIDArray
  let api_key = req.body.apiKey
  const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  connection.getConnection(function (err, conn) {
    if (err) {
      return errorHandler(err);
    }

    conn.beginTransaction((err) => {
      if (err) {
        return errorHandler(err);
      }

      let checkApiKey = `SELECT EXISTS(SELECT * FROM dev WHERE api_key = ?) AS count`
      conn.query(checkApiKey, [api_key], (err, result0) => {
        if (err) {
          return conn.rollback(() => {
            errorHandler(err);
          })
        }
        if (result0[0].count == 0) {
          return conn.rollback(() => {
            errorHandler("API key not valid");
          })
        }

        let insertCollection = `
      INSERT INTO collection (collection_id, collection_name, collection_creation_date, collection_last_edit_date, user_id) 
      VALUES (NULL, ?, ?, ?, ?);`
        conn.query(insertCollection, [collection_name, currentDateTime, currentDateTime, user_id], (err, result1) => {
          if (err) {
            return conn.rollback(() => {
              errorHandler(err);
            })
          }
          let insertAlbums = `INSERT INTO collection_album (collection_album_id, album_num, collection_id, album_id) VALUES (NULL, ?, ?, ?)`
          for (i = 1; i < album_ids.length; i++) {
            insertAlbums += `, (NULL, ?, ?, ?)`
          }
          let collection_id = result1.insertId;
          let inputs = [];
          for (i = 0; i < album_ids.length; i++) {
            inputs.push(i + 1)
            inputs.push(collection_id)
            inputs.push(album_ids[i])
          }

          conn.query(insertAlbums, inputs, (err, result2) => {
            if (err) {
              return conn.rollback(() => {
                errorHandler(err);
              })
            }

            conn.commit((err) => {
              if (err) {
                return conn.rollback(() => {
                  errorHandler(err);
                })
              } else {
                res.json({
                  success: true,
                  message: "collection successfully added",
                  itemsAdded: {
                    user_id,
                    collection_id,
                    collection_name,
                    album_ids,
                  }
                })
              }
            })
          })
        })
      })
    })
  })
})

module.exports = router;