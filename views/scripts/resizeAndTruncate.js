window.addEventListener('load', () => {
  responsive()
})
window.addEventListener('resize', () => {
  responsive()
})

const responsive = () => {
  // Truncate function
  const truncate = (string, length) => {
    if (string.length > length) {
      return string.substring(0, length - 1) + '...'
    } else {
      return string
    }
  }
  // Replace String function, from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring#Replacing_a_substring_within_a_string
  const replaceString = (oldS, newS, fullS) => {
    for (var i = 0; i < fullS.length; ++i) {
      if (fullS.substring(i, i + oldS.length) === oldS) {
        fullS = fullS.substring(0, i) + newS + fullS.substring(i + oldS.length, fullS.length)
      }
    }
    return fullS
  }
  // Source provider list truncation
  let links = document.querySelectorAll('.source')
  for (let i = 0; i < links.length; i++) {
    // This sets the title HTML attribute, so you can hover over and see it. (Plus accessibility)
    links[i].setAttribute('title', links[i].innerHTML)

    // This actually truncates using the function above.
    links[i].innerHTML = truncate(links[i].innerHTML, 37)
  }
  // Main pages: tvShows and movies truncation
  let titles = document.querySelectorAll('.card-title')
  if (window.matchMedia('(min-width: 780px)').matches) {
    let cards = document.querySelectorAll('.card:not(.season-selector)')
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.width = '250px'
      cards[i].childNodes[1].src = replaceString('http://image.tmdb.org/t/p/w154/', 'http://image.tmdb.org/t/p/w342/', cards[i].childNodes[1].src)
      cards[i].childNodes[1].style.height = '375px'
      titles[i].innerHTML = titles[i].title
      titles[i].innerHTML = truncate(titles[i].innerHTML, 30)
    }
  } else {
    let cards = document.querySelectorAll('.card')
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.width = '154px'
      cards[i].childNodes[1].src = replaceString('http://image.tmdb.org/t/p/w342/', 'http://image.tmdb.org/t/p/w154/', cards[i].childNodes[1].src)
      cards[i].childNodes[1].style.height = '231px'
      titles[i].innerHTML = titles[i].title
      titles[i].innerHTML = truncate(titles[i].innerHTML, 15)
    }
  }
}
