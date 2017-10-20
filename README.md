# Dionysus 
[![Build Status](https://travis-ci.org/MD5HashBrowns/dionysus.svg?branch=master)](https://travis-ci.org/MD5HashBrowns/dionysus) [![dependencies Status](https://david-dm.org/md5hashbrowns/dionysus/status.svg)](https://david-dm.org/md5hashbrowns/dionysus) [![devDependencies Status](https://david-dm.org/md5hashbrowns/dionysus/dev-status.svg)](https://david-dm.org/md5hashbrowns/dionysus?type=dev)

Dionysus is a Self-hosted TV Show and Movie streamer

## Setup
```
git clone https://github.com/MD5HashBrowns/dionysus.git
cd dionysus
npm install
```

## Configure
Make sure to set your API key in the `config.json` file. You can set other options like port number and quality.

### config.json:
```json
{
  "apiKey" : "INSERT_API_KEY",
  "port" : 3000,
  "quality": "720p"
}


```

## Run
From the dionysus directory run:
```
node app.js
```

Then visit [localhost:3000](http://localhost:3000) 
