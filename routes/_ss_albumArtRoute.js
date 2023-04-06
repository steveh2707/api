const express = require('express')
const router = express.Router();
const connection = require('../db')

router.get('/albumart', (req, res) => {

  let sql = `
  SELECT cover_image_url
    FROM album
    ORDER BY RAND () LIMIT 36;  
  `

  connection.query(sql, (err, images) => {
    if (err) {
      res.json(err)
    } else {


      res.json(images);
    }
  })
})


module.exports = router;