const express = require('express')
const app = express();
const connection = require('./db')

// import routes
const loginRoute = require('./routes/loginRoute')
const allCollectionsRoute = require('./routes/allCollectionsRoute')
const allAlbumsRoute = require('./routes/allAlbumsRoute')
const allArtistsRoute = require('./routes/allArtistsRoute')
const singleCollectionRoute = require('./routes/singleCollectionRoute')
const singleAlbumRoute = require('./routes/singleAlbumRoute')
const newCollectionRoute = require('./routes/newCollectionRoute')
const reordercollectionRoute = require('./routes/reorderCollectionRoute')
const userCollectionsRoute = require('./routes/userCollectionsRoute')
const newCommentRoute = require('./routes/newCommentRoute')

app.use(express.urlencoded({ extended: true }));

app.use(loginRoute)
app.use(allCollectionsRoute)
app.use(allAlbumsRoute)
app.use(allArtistsRoute)
app.use(singleCollectionRoute)
app.use(singleAlbumRoute)
app.use(newCollectionRoute)
app.use(reordercollectionRoute)
app.use(userCollectionsRoute)
app.use(newCommentRoute)

app.listen((process.env.port || 4000), () => {
  console.log("API listening on port: 4000")
})