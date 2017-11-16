# Dionysus 
[![travis][travis-img]][travis-url] [![david][david-img]][david-url] [![david dev][david-dev-img]][david-dev-url] [![standard style][standard-img]][standard-url]


[david-img]: https://img.shields.io/david/md5hashbrowns/dionysus.svg?style=flat-square
[david-url]: https://david-dm.org/md5hashbrowns/dionysus

[david-dev-img]: https://img.shields.io/david/dev/md5hashbrowns/dionysus.svg?style=flat-square
[david-dev-url]: https://david-dm.org/md5hashbrowns/dionysus?type=dev

[travis-img]: https://img.shields.io/travis/MD5HashBrowns/dionysus.svg?style=flat-square
[travis-url]: https://travis-ci.org/MD5HashBrowns/dionysus/

[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://standardjs.com

Dionysus is a Self-hosted TV Show and Movie streamer

## Setup
```
git clone https://github.com/MD5HashBrowns/dionysus.git
cd dionysus
npm install
```
## Api Keys
You'll need an API key from [alluc](http://accounts.alluc.com/register.html) and from [tmdb](https://www.themoviedb.org/account/signup). (Both require signups). 

## Configure
Create a file called `config.env` in the root of the projects directory. Here you need to set your API keys. You can also set other options like port number and quality.
### config.env:
```bash
ALLUC_API_KEY=INSERT_ALLUC_API_KEY_HERE
TMDB_API_KEY=INSERT_TMDB_API_KEY_HERE
PORT=3000
QUALITY=720p
```
__Warning__: Don't put your API Key in quotes! The entire world will end.

__Note__:  If you don't want to specify quality, leave it as `QUALITY=`. (You will get many more results / streams this way).
### Example config.env
```bash
ALLUC_API_KEY=ckazx56qh20ok5sy6d78tzq700spze6i
TMDB_API_KEY=ml3cp62vuta5n4w8lna3v0qe0729p12d
PORT=3000
QUALITY=720p
```
## Run
From the dionysus directory run:
```
npm start
```

Then visit [localhost:3000](http://localhost:3000) 

## To-Do
- [ ] Add vidzi support
- [ ] Fix Openload's "Embed Blocked" error
- [ ] Create REST API
- [ ] Utlize React.js
- [ ] Modularize app.js into seperate files
- [ ] Add better navigation
- [ ] Autoplay whatever exists, not just first openload link
- [ ] Better discovery section (will require React)
- [ ] Trakt integration
