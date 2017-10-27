// TODO:
// Modularize code into seperate files
// Utilize Multi Search, to be able to search for movies and TV shows at the same time.
// Episodes should have the name of the episode on the list (Instead of episode number). When clicking on a specific episode you should get a page similiar to the watch movie page. Maybe some kind of back button and/or the name of the show that you can click on to and go back to main page.
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
  res.merge('nothingness', {
        // external url to fetch
    sourceUrl: 'http://thevideo.me/embed-' + req.params.id + '-640x360.html',
       // css selector to inject our content into
    sourcePlaceholder: 'script:nth-of-type(4)',
       // pass a function here to intercept the source html prior to merging
    transform: null
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
app.get('/watch-episode/:id/:season/:episode/:name', function (req, res) {
  tmdb.tvEpisodeInfo({id: req.params.id, season_number: req.params.episode, episode_number: req.params.episode}, (err, episodeInfo) => {
    if (err) {
      console.log("TMDb couldn't retrieve episode info")
      console.log(err)
    }

    var seasonNum = req.params.season
    var episodeNum = req.params.episode
    if (seasonNum < 10) {
      seasonNum = '0' + seasonNum.toString()
    }
    if (episodeNum < 10) {
      episodeNum = '0' + episodeNum.toString()
    }

    // Alluc Openload request
    request('https://www.alluc.ee/api/search/stream/?apikey=' + process.env.ALLUC_API_KEY + '&query=' + urlencode(req.params.name) + '%20' + 'S' + seasonNum + 'E' + episodeNum + '%20' + process.env.QUALITY + '%20' + 'host%3Aopenload.co%2Cthevideo.me%2Cdocs.google.com' + '&count=20&from=0&getmeta=0', function (error, response, body) {
      if (error) {
        console.log('Alluc API request for episode failed')
      }
      // Simple JSON parse from the request

      var parsedBody = JSON.parse(body)

      var openloadLinks = [] // Initialize Openload links array
      var openloadTitles = [] // Initialize Openload titles array

      var thevideoLinks = []
      var thevideoTitles = []

      var gdocsLinks = []
      var gdocsTitles = []

      if (parsedBody['result'].length > 0) {
        for (let i = 0; i < parsedBody['result'].length; i++) {
          if (parsedBody['result'][i]['hostername'] === 'openload.co') {
            openloadLinks[i] = parsedBody['result'][i]['hosterurls'][0]['url']
            openloadTitles[i] = parsedBody['result'][i]['title']
          }
          if (parsedBody['result'][i]['hostername'] === 'thevideo.me') {
            thevideoLinks[i] = parsedBody['result'][i]['hosterurls'][0]['url']
            thevideoTitles[i] = parsedBody['result'][i]['title']
          }
          if (parsedBody['result'][i]['hostername'] === 'docs.google.com') {
            gdocsLinks[i] = parsedBody['result'][i]['hosterurls'][0]['url']
            gdocsTitles[i] = parsedBody['result'][i]['title']
          }
        }
        var streamsError = '' // Sets the stream error content to nothing
      } else {
        console.log("ERR: There's no streams available") // Logging
        streamsError = 'Sorry, there are no streams available for this TV Show :(' // Gives stream error some content
      }

      // Filters all the non-links out. I'm sure theres a way to avoid this by utilizing some other kind of structure above
      openloadLinks = openloadLinks.filter(function (n) { return n !== undefined })
      openloadTitles = openloadTitles.filter(function (n) { return n !== undefined })
      thevideoLinks = thevideoLinks.filter(function (n) { return n !== undefined })
      thevideoTitles = thevideoTitles.filter(function (n) { return n !== undefined })
      gdocsLinks = gdocsLinks.filter(function (n) { return n !== undefined })
      gdocsTitles = gdocsTitles.filter(function (n) { return n !== undefined })
      tmdb.tvInfo({id: req.params.id}, (err, tvInfo) => {
        if (err) {
          console.log("TMDb Couldn't retrieve TV Info")
        }
        res.render('watchEpisode', {
          openloadLinks: openloadLinks,
          openloadTitles: openloadTitles,
          thevideoLinks: thevideoLinks,
          thevideoTitles: thevideoTitles,
          gdocsLinks: gdocsLinks,
          gdocsTitles: gdocsTitles,
          title: 'Dionysus',
          page: 'tvShows',
          episodeInfo: episodeInfo,
          tvInfo: tvInfo,
          streamsError: streamsError
        })
      })
    })
  })
})
app.get('/watch-movie/:id', function (req, res) {
  tmdb.movieInfo({id: req.params.id}, (err, movieInfo) => {
    if (err) {
      console.log("TMDb Couldn't retrieve movie info")
    }
    // Concatenation is fun :D
    request('https://www.alluc.ee/api/search/stream/?apikey=' + process.env.ALLUC_API_KEY + '&query=' + movieInfo.title + '%20' + movieInfo.release_date.substring(0, 4) + '%20' + 'host%3Athevideo.me%2Copenload.co%2Cdocs.google.com' + '&count=20&from=0&getmeta=1', function (error, response, body) {
      if (error) {
        console.log('Alluc API request for movie failed')
      }
      // Simple JSON parse from the request
      var parsedBody = JSON.parse(body)

      var openloadLinks = [] // Initialize Openload links array
      var openloadTitles = [] // Initialize Openload titles array

      var thevideoLinks = []
      var thevideoTitles = []

      var gdocsLinks = []
      var gdocsTitles = []

      if (parsedBody['result'].length > 0) {
        for (let i = 0; i < parsedBody['result'].length; i++) {
          if (parsedBody['result'][i]['hostername'] === 'openload.co') {
            openloadLinks[i] = parsedBody['result'][i]['hosterurls'][0]['url']
            openloadTitles[i] = parsedBody['result'][i]['title']
          }
          if (parsedBody['result'][i]['hostername'] === 'thevideo.me') {
            thevideoLinks[i] = parsedBody['result'][i]['hosterurls'][0]['url']
            thevideoTitles[i] = parsedBody['result'][i]['title']
          }
          if (parsedBody['result'][i]['hostername'] === 'docs.google.com') {
            gdocsLinks[i] = parsedBody['result'][i]['hosterurls'][0]['url']
            gdocsTitles[i] = parsedBody['result'][i]['title']
          }
        }
        var streamsError = '' // Sets the stream error content to nothing
      } else {
        console.log("ERR: There's no streams available") // Logging
        streamsError = 'Sorry, there are no streams available for this Movie :(' // Gives stream error some content
      }

      // Filters all the non-links out. I'm sure theres a way to avoid this by utilizing some other kind of structure above
      openloadLinks = openloadLinks.filter(function (n) { return n !== undefined })
      openloadTitles = openloadTitles.filter(function (n) { return n !== undefined })
      thevideoLinks = thevideoLinks.filter(function (n) { return n !== undefined })
      thevideoTitles = thevideoTitles.filter(function (n) { return n !== undefined })
      gdocsLinks = gdocsLinks.filter(function (n) { return n !== undefined })
      gdocsTitles = gdocsTitles.filter(function (n) { return n !== undefined })

      res.render('watchMovie', {
        openloadLinks: openloadLinks,
        openloadTitles: openloadTitles,
        thevideoLinks: thevideoLinks,
        thevideoTitles: thevideoTitles,
        gdocsLinks: gdocsLinks,
        gdocsTitles: gdocsTitles,
        title: 'Dionysus',
        page: 'movies',
        movieInfo: movieInfo,
        streamsError: streamsError
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
