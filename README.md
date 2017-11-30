# Dionysus
[![travis][travis-img]][travis-url] [![david][david-img]][david-url] [![david dev][david-dev-img]][david-dev-url] [![standard style][standard-img]][standard-url]


[david-img]: https://img.shields.io/david/adcar/dionysus.svg?style=flat-square
[david-url]: https://david-dm.org/adcar/dionysus

[david-dev-img]: https://img.shields.io/david/dev/adcar/dionysus.svg?style=flat-square
[david-dev-url]: https://david-dm.org/adcar/dionysus?type=dev

[travis-img]: https://img.shields.io/travis/adcar/dionysus.svg?style=flat-square
[travis-url]: https://travis-ci.org/adcar/dionysus/

[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://standardjs.com

Dionysus is a Self-hosted TV Show and Movie streamer

## Setup
```
git clone https://github.com/adcar/dionysus.git
cd dionysus
npm install
```
## MovieDB Api Key
You'll need an API key from [tmdb](https://www.themoviedb.org/account/signup). (Requires a signup).

## Configure
Create a file called `config.env` in the root of the projects directory. Here you need to set your TMDB API key. You can also set other options like port number.
### config.env:
```bash
TMDB_API_KEY=INSERT_TMDB_API_KEY_HERE
```
__Warning__: Don't put your API Key in quotes! The entire world will end.

### Example config.env
```bash
TMDB_API_KEY=ml3cp62vuta5n4w8lna3v0qe0729p12d
PORT=3000
```
## Run
From the dionysus directory run:
```
npm start
```

Then visit [localhost:3000](http://localhost:3000)

## To-Do
- [x] Move away from Alluc
- [ ] Fix Openload's "Embed Blocked" error. Will have to disable sandbox and route through node-iframe-replacement and stripping any ads.
- [ ] Create RESTful API
- [ ] Utlize React.js
- [ ] Modularize app.js into seperate files
- [ ] Add better navigation
- [ ] Autoplay whatever exists, not just first openload link
- [ ] Better discovery section (will require React)
- [ ] Trakt integration
