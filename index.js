const express = require('express')
const app = express();
const connection = require('./db')

// import routes
const collectionsRoute = require('./routes/collectionsRoute')
const collectionsSubRoute = require('./routes/collectionsSubRoute')
const albumsRoute = require('./routes/albumsRoute')
const artistsRoute = require('./routes/artistsRoute')
const newCollectionRoute = require('./routes/newCollectionRoute')
const albumArtRoute = require('./routes/albumArtRoute')
const loginRoute = require('./routes/loginRoute')


app.use(express.urlencoded({ extended: true }));

app.use(collectionsRoute)
app.use(collectionsSubRoute)
app.use(albumsRoute)
app.use(artistsRoute)
app.use(newCollectionRoute)
app.use(albumArtRoute)
app.use(loginRoute)


app.listen((process.env.port || 4000), () => {
  console.log("API listening on port: 4000")
})