// TODO:
// Modularize code into seperate files
// Seperate API Calls to search for Google Docs, then openload, then thevideo.me. Put them all in arrays then present them to end user.
// Make sure everything is responsive, including iframes and fanart backgrounds.
// Utilize Multi Search, to be able to search for movies and TV shows at the same time.
// Episodes should have the name of the episode on the list (Instead of episode number). When clicking on a specific episode you should get a page similiar to the watch movie page. Maybe some kind of back button and/or the name of the show that you can click on to and go back to main page.
// NOTE: IMDB HAS SUPPORT FOR tvEpisodeInfo, which uses the id of the show as well as the season and episode number. I will be using this to accomplish the aboe task.
// Slideshow on main TV Show and Movies page. One slideshow for each genre. Similiar to Netflix layout.
// Trakt integration, to allow users to save movies. Trakt doesn't have fanart so I will still utilize TMDB for the main API.
// Convert Everything into promises. I could use either Trakt combined with TMDb (fanart) or I could use promises wrapper for TMDb.
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const request = require('request')
const urlencode = require('urlencode')
const iframeReplacement = require('node-iframe-replacement')

// Pull in config enviroment variables
require('env2')('./config.env')

// Handle some errors if default values
if (process.env.ALLUC_API_KEY === 'INSERT_ALLUC_API_KEY_HERE') {
  throw Error('You have not entered your Alluc API Key in config.env. Please visit http://accounts.alluc.com/ and register for an account to get an API key.')
}
if (process.env.TMDB_API_KEY === 'INSERT_TMDB_API_KEY_HERE') {
  throw Error('You have not entered your Trakt ID and/or Trakt Secret in config.env. Please visit https://trakt.tv/oauth/applications/new to create a Trakt app and get these credientials')
}

// Pull in tmdb and set API key.
const tmdb = require('moviedb')(process.env.TMDB_API_KEY)

// Set express to app
const app = express()
// Set viewing engine to ejs
app.set('view engine', 'ejs')
// Set the path to views directory.
app.set('views', path.join(__dirname, 'views'))
// Set the static directory for express. This is needed for static content like CSS and JS. Could be changed to something else for a seperate location of CSS/JS/IMG etc.
app.use(express.static(path.join(__dirname, '/views')))

// Body Parser middleware. Needed for capturing data from POST requests.
app.use(bodyParser.urlencoded({ extended: false }))

// iframe replacement middleware (adds res.merge)
app.use(iframeReplacement)

app.get('/watch-thevideo/:id', function (req, res) {
  console.log(req.params.id)
    // respond to this request with our fake-news content embedded within the BBC News home page
  res.merge('nothingness', {
        // external url to fetch
    sourceUrl: 'http://thevideo.me/embed-' + req.params.id + '-640x360.html',
       // css selector to inject our content into
    sourcePlaceholder: 'script:nth-of-type(4)',
       // pass a function here to intercept the source html prior to merging
    transform: function ($, model) { }
  })
})

app.get('/', function (req, res) { // For now I just have a redirect going to TV Shows. I could possibly have a page that shows both movies and TV Shows, then lets you pick between them.
  res.redirect('/tv-shows')
})

// TMDb
tmdb.miscPopularMovies((err, movies) => {
  if (err) {
    console.log("TMDb couldn't get Popular Movies")
  }
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
  if (err) {
    console.log("TMDb couldn't get Popular TV Shows")
  }
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
  tmdb.tvInfo({id: req.params.id}, (err, tvInfo) => {
    if (err) {
      console.log("TMDb Couldn't retrieve TV Show info")
    }
    res.render('watchTvShow', { // Render the watch page and pass some variables
      title: 'Dionysus',
      tvInfo: tvInfo,
      // episode: info,
      page: 'tvShows'
    })
  })
})

// The watch episode page should use TMDb instead.
app.get('/watch-episode/:id', function (req, res) {
  // I must directly interact with Alluc API via `request` due to lack of npm module
  // Concatenation is fun :D
  request('https://www.alluc.ee/api/search/stream/?apikey=' + process.env.ALLUC_API_KEY + '&query=' + urlencode(req.params.id) + '%20' + process.env.QUALITY + '%20' + 'host%3Aopenload.co' + '&count=4&from=0&getmeta=0', function (error, response, body) {
    if (error) {
      console.log('Alluc API request for episode failed')
    }
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
      streamsError = 'Sorry, there are no streams available for this TV Show :(' // Gives stream error some content
    }

    console.log('LINKS: ' + links) // Logging
    res.render('watchEpisode', {
      link1: links[0],
      link2: links[1],
      link3: links[2],
      link4: links[3],
      title: 'Dionysus',
      page: 'tvShows',
      streamsError
    })
  })
})

app.get('/watch-movie/:id', function (req, res) {
  tmdb.movieInfo({id: req.params.id}, (err, movieInfo) => {
    if (err) {
      console.log("TMDb Couldn't retrieve movie info")
    }
    // Concatenation is fun :D
    request('https://www.alluc.ee/api/search/stream/?apikey=' + process.env.ALLUC_API_KEY + '&query=' + movieInfo.title + '%20' + movieInfo.release_date.substring(0, 4) + '%20' + 'host%3Athevideo.me' + '&count=4&from=0&getmeta=1', function (error, response, body) {
      if (error) {
        console.log('Alluc API request for movie failed')
      }
      // Simple JSON parse from the request
      var parsedBody = JSON.parse(body)

      var links = [] // Initialize links array
      for (let i = 0; i < 4; i++) { //  Creates an array with everything filled with "" (nothing) rather than undefined. (Undefined will cause node server to crash)
        links.push('')
      }
      if (parsedBody['result'].length > 0) {
        for (let i = 0; i < parsedBody['result'].length; i++) {
          links[i] = parsedBody['result'][i]['hosterurls'][0]['url'] // Replaces "" with links
          console.log(parsedBody['result'][i]['hosterurls'])
        }
        var streamsError = '' // Sets the stream error content to nothing
      } else {
        console.log("ERR: There's no streams available") // Logging
        streamsError = 'Sorry, there are no streams available for this TV Show / Movie :(' // Gives stream error some content
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
  var search = req.params.id
  tmdb.searchMovie({ query: search }, (err, response) => {
    if (err) {
      console.log("TMDb Couldn't search for movies")
    }
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
  var search = req.params.id
  tmdb.searchTv({ query: search }, (err, response) => {
    if (err) {
      console.log("TMDb Couldn't search for TV Shows")
    }
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
