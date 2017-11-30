/*
    ./client/index.js
*/
import React from 'react'
import ReactDOM from 'react-dom'
import getsy from 'getsy'
getsy('http://itswatchseries.to/episode/mr_robot_s1_e3.html', {corsProxy: 'https://cors-anywhere.herokuapp.com/'}).then(myGetsy => {
  let unparsedLinks = myGetsy.getMe('td.deletelinks a')
  let links = []
  for (let i = 0; i < unparsedLinks.length; i++) {
    links.push(unparsedLinks[i].getAttribute('onclick').replace(/if \(confirm\('Delete link /g, '').replace(/'\)\).*$/, ''))
  }
  links = links.sort()
  const element = (
    <ul>
      {links.map((name, index) => {
        return <li key={index}>{name}</li>
      })}
    </ul>
  )
  console.log(links)

  ReactDOM.render(
    element, // The first argument is what you're rendering
    document.getElementById('root') // The second argument is where you're putting the rendered stuff.
  )
})
