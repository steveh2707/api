const express = require('express')
const router = express.Router();
const connection = require('../db')
const errorHandler = require('./handlers').errorHandler
const dataHandler = require('./handlers').dataHandler

router.post('/login', (req, res) => {

  let user_name = req.body.user_name
  let password = req.body.password

  let sql = `
    SELECT * FROM user WHERE user_name = ? AND user_password = MD5(?);
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


router.post('/register', (req, res) => {

  let user_name = req.body.user_name;
  let password = req.body.password;
  let dob = req.body.dob;
  let gender = req.body.gender
  let nationality = req.body.nationality

  let checkUserNameSql = `
  SELECT COUNT(*) as count FROM user WHERE user_name=?;
  `

  let insertSql = `
  INSERT INTO user (user_id, user_name, user_password, user_gender, user_dob, user_nationality) 
  VALUES (NULL, ?, MD5(?), ?, ?, ?)
  `

  console.log(req.body)

  connection.query(checkUserNameSql, [user_name], (err, response) => {
    if (err) return res.json(errorHandler("Database connection error", err));

    if (response[0].count > 0) return res.json(errorHandler("Username already exists", err));

    connection.query(insertSql, [user_name, password, gender, dob, nationality], (err, response2) => {
      if (err) return res.json(errorHandler("Database connection error", err));

      console.log(response2.insertId)

      let user = {
        user_id: response2.insertId,
        user_name: user_name
      }

      res.json(dataHandler("User successfully logged in", user))
    })

  })

})


module.exports = router;