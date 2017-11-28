// TODO:
// Modularize code into seperate files
// Slideshow on main TV Show and Movies page. One slideshow for each genre. Similiar to Netflix layout.
// Trakt integration, to allow users to save movies. Trakt doesn't have fanart so I will still utilize TMDB for the main API.
// Add better navigation support for TV Shows and Movies. E.g., a back button.
// Auto play whatever exists, not just openload[0]
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const iframeReplacement = require('node-iframe-replacement')
const limits = require('limits.js')
const throttle = limits().within(1000, 3)
const removeAccents = require('remove-accents')

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
const _tmdb = require('moviedb')(process.env.TMDB_API_KEY)

// Promises wrapper
const tmdb = (m, q) => new Promise((resolve, reject) => {
  throttle.push(() => _tmdb[m](q, (err, data) => err ? reject(err) : resolve(data)))
})

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

app.get('/putstream/:url', function (req, res) {
  res.merge('removeAds', {
        // external url to fetch
    sourceUrl: 'https://putstream.com/' + req.params.url,
       // css selector to inject our content into
    sourcePlaceholder: "script[src='https://coinhive.com/lib/coinhive.min.js'] + script",
       // pass a function here to intercept the source html prior to merging
    transform: null
  })
})

app.get('/', function (req, res) { // For now I just have a redirect going to TV Shows. I could possibly have a page that shows both movies and TV Shows, then lets you pick between them.
  res.redirect('/tv-shows')
})

// Movies page
tmdb('discoverMovie', { 'sort_by': 'popularity.desc', 'primary_release_year': '2016' }).then(movies => {
  app.get('/movies', function (req, res) {
    res.render('movies', {
      title: 'Dionysus',
      movies: movies,
      page: 'movies'
    })
  })
})

// TV Shows page
tmdb('miscPopularTvs').then(tvShows => {
  app.get('/tv-shows', function (req, res) {
    res.render('tvShows', {
      title: 'Dionysus',
      tvShows: tvShows,
      page: 'tvShows'
    })
  })
})

tmdb('miscPopularTvs').then(tvShows => {
  app.get('/watch-tv-show/:id', function (req, res) {
    tmdb('tvInfo', {id: req.params.id}).then(tvInfo => {
      var promises = []
      for (let i = 0; i < tvInfo.seasons.length; i++) {
        // Here I check to see if the season 0 has a season_number of 0, if it does then I can include specials, if not then add 1.
        if (tvInfo.seasons[0].season_number === 0) {
          promises.push(tmdb('tvSeasonInfo', {id: tvInfo.id, season_number: i}))
        } else {
          promises.push(tmdb('tvSeasonInfo', {id: tvInfo.id, season_number: i + 1}))
        }
      }
      Promise.all(promises)
      .then(seasonInfo => {
        res.render('watchTvShow', {
          title: tvInfo.name + ' - Dionysus',
          seasonInfo: seasonInfo,
          tvInfo: tvInfo,
          page: 'tvShows'
        })
      })
      // .catch(err => {
      //   console.log(err)
      // })
    })
  })
})
// The watch episode page should use TMDb instead.
app.get('/watch-episode/:id/:season/:episode/:name', function (req, res) {
  tmdb('tvEpisodeInfo', {id: req.params.id, season_number: req.params.season, episode_number: req.params.episode}).then(episodeInfo => {
    // Some 'sanitization' if you will. Just fixes accents (with library) and gets rid of any special characters. E.g., a dot (.).
    req.params.name = removeAccents(req.params.name)
    req.params.name = req.params.name.replace(/[^\w\s]/gi, ' ') // replaces special chars with space
    var seasonNum = req.params.season
    var episodeNum = req.params.episode
    if (seasonNum < 10) {
      seasonNum = '0' + seasonNum.toString()
    }
    if (episodeNum < 10) {
      episodeNum = '0' + episodeNum.toString()
    }

    tmdb('tvInfo', {id: req.params.id}).then(tvInfo => {
      res.render('watchEpisode', {
        title: tvInfo.name + ' S' + req.params.season + ':E' + req.params.episode + ' - Dionysus',
        page: 'tvShows',
        episodeInfo: episodeInfo,
        tvInfo: tvInfo,
        seasonNum: seasonNum,
        episodeNum: episodeNum
      })
    })
  })
  .catch(err => {
    console.log(err)
  })
})

app.get('/watch-movie/:id', function (req, res) {
  tmdb('movieInfo', {id: req.params.id}).then(movieInfo => {
    res.render('watchMovie', {
      title: movieInfo.title + ' - Dionysus',
      page: 'movies',
      movieInfo: movieInfo
    })
  })
})

app.get('/search', function (req, res) {
  var search = req.query.q
  tmdb('searchMulti', { query: search }).then(response => {
    res.render('search', {
      title: search + ' - Dionysus Search',
      searchResults: response.results,
      page: 'null'
    })
  })
})

app.post('/search/submit', function (req, res) {
  res.redirect('/search?q=' + req.body.search)
})

app.listen(process.env.PORT, function () {
  console.log('Dionysus server started on port ' + process.env.PORT + '...')
})
