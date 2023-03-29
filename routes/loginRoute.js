const express = require('express')
const router = express.Router();
const connection = require('../db')

router.post('/login', (req, res) => {

  let user_name = req.body.user_name
  let password = req.body.password

  let sql = `
    SELECT * FROM user WHERE user_name = ? AND user_password = ?
  `

  // console.log(req.body)
  // console.log(password)

  connection.query(sql, [user_name, password], (err, response) => {

    if (err) {
      res.json(err)
    } else {

      if (response && response.length) {
        res.json({
          success: true,
          message: "user successfully logged in",
          user: {
            user_id: response[0].user_id,
            user_name: response[0].user_name
          }
        })
      } else (
        res.json({
          success: false,
          message: "Unsuccessful login - username or password incorrect",
        })
      )
    }
  })
})


module.exports = router;