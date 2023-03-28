const express = require('express')
const router = express.Router();
const connection = require('../db')



router.post('/collection/add', (req, res) => {

  let securekey = req.query.key;

  if (securekey === '123456') {

    let user_id = Number(req.body.user_id);
    let collection_name = req.body.collection_name;
    let album_ids = JSON.parse(req.body.album_ids)

    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let insert = `
    INSERT INTO collection (collection_id, collection_name, collection_creation_date, collection_last_edit_date, user_id) 
    VALUES (NULL, ?, ?, ?, ?)
    `
    let inputs = [collection_name, currentDateTime, currentDateTime, user_id]

    console.log(inputs)



    // connection.query(insert, inputs, (err, result) => {
    //   if (err) {
    //     res.json(err)
    //   } else {
    res.json({
      message: "success",
      itemsAdded: {
        user_id,
        collection_name,
        album_ids
      }
    })
    //   }
    // })
  } else {
    res.json({ message: "api key not valid" })
  }


})

module.exports = router;