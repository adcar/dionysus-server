# Dionysus
A Self-hosted TV Show and Movie streamer

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

