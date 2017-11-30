/*
    ./client/components/App.jsx
*/
import React from 'react'
import Getsy from 'getsy'


export default class App extends React.Component {


  Getsy('http://itswatchseries.to/episode/south_park_s19_e3.html', {corsProxy: 'https://cors-anywhere.herokuapp.com/'}).then(myGetsy => {
    let unparsedLinks = myGetsy.getMe('td.deletelinks a')
    let links = []
    for (let i = 0; i < unparsedLinks.length; i++) {
      links.push(unparsedLinks[i].getAttribute('onclick').replace(/if \(confirm\('Delete link /g, '').replace(/'\)\).*$/, ''))
    }
    console.log(links)
    const element = (
    <div>
      <h1>Hello, {username}.</h1>
			<h2>{msg}</h2>
    </div>
    )
    render () {
      return (
        element
      )
    }
  })
