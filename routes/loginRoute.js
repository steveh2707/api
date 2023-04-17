const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler

router.post('/login', (req, res) => {

  let user_name = req.body.user_name
  let password = req.body.password

  let sql = `
    SELECT * FROM user WHERE user_name = ? AND user_password = ?;
  `

  connection.query(sql, [user_name, password], (err, response) => {

    if (err) return res.json(errorHandler("Database connection error", err));

    if (response && response.length) {

      let user = {
        user_id: response[0].user_id,
        user_name: response[0].user_name
      }

      let collectionsSql = `SELECT collection_id, collection_name FROM collection WHERE user_id=?`
      connection.query(collectionsSql, [response[0].user_id], (err, response2) => {
        if (err) return res.json(errorHandler("Database connection error", err));

        user.user_collections = response2

        res.json(dataHandler("User successfully logged in", user))
      })

    } else res.json(errorHandler("Unsuccessful login - username or password incorrect", err));

  })
})


module.exports = router;