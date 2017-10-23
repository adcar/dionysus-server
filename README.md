# Dionysus 
[![Build Status](https://travis-ci.org/MD5HashBrowns/dionysus.svg?branch=master)](https://travis-ci.org/MD5HashBrowns/dionysus) [![dependencies Status](https://david-dm.org/md5hashbrowns/dionysus/status.svg)](https://david-dm.org/md5hashbrowns/dionysus) [![devDependencies Status](https://david-dm.org/md5hashbrowns/dionysus/dev-status.svg)](https://david-dm.org/md5hashbrowns/dionysus?type=dev)

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
Make sure to set your API key in the `config.env` file. You can also set other options like port number and quality.

### config.env:
```bash
ALLUC_API_KEY=INSERT_ALLUC_API_KEY_HERE
TMDB_API_KEY=INSERT_TMDB_API_KEY_HERE
PORT=3000
QUALITY=720p
```
__Note__: Don't put your API Key in quotes! The entire world will end.
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
