const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const request = require('request')
const urlencode = require('urlencode')

// Pull in config enviroment variables
require('env2')('./config.env')

// Handle some errors if default values
if (process.env.ALLUC_API_KEY == 'INSERT_ALLUC_API_KEY_HERE') {
  throw Error('You have not entered your Alluc API Key in config.env. Please visit http://accounts.alluc.com/ and register for an account to get an API key.')
}
if (process.env.TMDB_API_KEY == 'INSERT_TMDB_API_KEY_HERE') {
  throw Error('You have not entered your Trakt ID and/or Trakt Secret in config.env. Please visit https://trakt.tv/oauth/applications/new to create a Trakt app and get these credientials')
}

const tmdb = require('moviedb')(process.env.TMDB_API_KEY)

const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + '/views'))

// Body Parser middleware
app.use(urlencodedParser = bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.redirect('/tv-shows')
})

// TMDb
tmdb.miscPopularMovies((err, movies) => {
  // Get movie page
  app.get('/movies', function (req, res) {
    res.render('movies', {
      title: 'Dionysus',
      movies: movies,
      page: 'movies'
    })
  })
})

tmdb.miscPopularTvs((err, tvShows) => {
  // Get TV Shows page
  app.get('/tv-shows', function (req, res) {
    res.render('tvShows', {
      title: 'Dionysus',
      tvShows: tvShows,
      page: 'tvShows'
    })
  })
})


// NOTE: Instead of having two watch gets I could have one and check whether it's a movie or not based on it's ID, they could render either watchMovie or watchTvShow. But I mean, whos got time for that.
app.get('/watch-tv-show/:id', function (req, res) {
  tmdb.tvInfo({ id: req.params.id}, (err, tvInfo) => {


      res.render('watchTvShow', { // Render the watch page and pass some variables
        title: 'Dionysus',
        tvInfo: tvInfo,
        page: 'tvShows'
      })
    })
  })


app.get('/watch-episode/:id', function (req, res){


  // I must directly interact with Alluc API via `request` due to lack of npm module
  // Concatenation is fun :D
  request('https://www.alluc.ee/api/search/stream/?apikey=' + process.env.ALLUC_API_KEY + '&query=' + urlencode(req.params.id) + '%20' + process.env.QUALITY + '%20' + 'host%3Aopenload.co' + '&count=4&from=0&getmeta=0', function (error, response, body) {
    // Simple JSON parse from the request

    var parsedBody = JSON.parse(body)

    var links = [] // Initialize links array
    for (let i = 0; i < 4; i++) { //  Creates an array with everything filled with "" (nothing) rather than undefined. (Undefined will cause node server to crash)
      links.push('')
    }

    if (parsedBody['result'].length > 0) {
      for (let i = 0; i < parsedBody['result'].length; i++) {
        links[i] = parsedBody['result'][i]['hosterurls'][0]['url'] // Replaces "" with links
      }
      var streamsError = '' // Sets the stream error content to nothing
    } else {
      console.log("ERR: There's no streams available") // Logging
      var streamsError = 'Sorry, there are no streams available for this TV Show :(' // Gives stream error some content
    }

    console.log('LINKS: ' + links) // Logging
    res.render('watchEpisode', {
      link1: links[0],
      link2: links[1],
      link3: links[2],
      link4: links[3],
      title: 'Dionysus',
      page: 'tvShows',
      streamsError, streamsError
    })
  })
})

app.get('/watch-movie/:id', function (req, res) {

  tmdb.movieInfo({ id: req.params.id}, (err, movieInfo) => {
    // Concatenation is fun :D
    request('https://www.alluc.ee/api/search/stream/?apikey=' + process.env.ALLUC_API_KEY + '&query=' + movieInfo.title + '%20' + movieInfo.release_date.substring(0, 4) + "%20" + process.env.QUALITY + '%20' + 'host%3Aopenload.co' + '&count=4&from=0&getmeta=0', function (error, response, body) {
      // Simple JSON parse from the request
      var parsedBody = JSON.parse(body)

      var links = [] // Initialize links array
      for (let i = 0; i < 4; i++) { //  Creates an array with everything filled with "" (nothing) rather than undefined. (Undefined will cause node server to crash)
        links.push('')
      }

      if (parsedBody['result'].length > 0) {
        for (let i = 0; i < parsedBody['result'].length; i++) {
          links[i] = parsedBody['result'][i]['hosterurls'][0]['url'] // Replaces "" with links
        }
        var streamsError = '' // Sets the stream error content to nothing
      } else {
        console.log("ERR: There's no streams available") // Logging
        var streamsError = 'Sorry, there are no streams available for this TV Show / Movie :(' // Gives stream error some content
      }

      console.log('LINKS: ' + links) // Logging

      res.render('watchMovie', { // Render the watch page and pass some variables
        link1: links[0],
        link2: links[1],
        link3: links[2],
        link4: links[3],
        title: 'Dionysus',
        streamsError: streamsError,
        movieInfo: movieInfo,
        page: 'movies'
      })
    })
  })
})

app.get('/search-movies/:id', function (req, res) {
  search = req.params.id
  tmdb.searchMovie({ query: search }, (err, response) => {
    res.render('searchMovies', {
      title: search,
      searchResults: response.results,
      page: 'movies'
    })
  })
})

app.post('/search-movies/submit', function (req, res) {
  res.redirect('/search-movies/' + req.body.searchMovies)
})

app.get('/search-tv-shows/:id', function (req, res) {
  search = req.params.id
  tmdb.searchTv({ query: search }, (err, response) => {
    res.render('searchTvShows', {
      title: search,
      searchResults: response.results,
      page: 'tvShows'
    })
  })
})

app.post('/search-tv-shows/submit', function (req, res) {
  res.redirect('/search-tv-shows/' + req.body.searchTvShows)
})

app.listen(process.env.PORT, function () {
  console.log('Dionysus server started on port ' + process.env.PORT + '...')
})
