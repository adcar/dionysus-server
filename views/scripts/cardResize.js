window.addEventListener('load', () => {
  responsive()
})
window.addEventListener('resize', () => {
  responsive()
})

const responsive = () => {
  // Replace String function, from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring#Replacing_a_substring_within_a_string
  const replaceString = (oldS, newS, fullS) => {
    for (var i = 0; i < fullS.length; ++i) {
      if (fullS.substring(i, i + oldS.length) === oldS) {
        fullS = fullS.substring(0, i) + newS + fullS.substring(i + oldS.length, fullS.length)
      }
    }
    return fullS
  }
  // Main pages: tvShows and movies truncation
  if (window.matchMedia('(min-width: 780px)').matches) {
    let cards = document.querySelectorAll('.card:not(.season-selector)')
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.width = '250px'
      cards[i].childNodes[1].src = replaceString('w154', 'w342', cards[i].childNodes[1].src)
      cards[i].childNodes[1].style.height = '375px'
    }
  } else {
    let cards = document.querySelectorAll('.card:not(.season-selector)')
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.width = '154px'
      cards[i].childNodes[1].src = replaceString('w342', 'w154', cards[i].childNodes[1].src)
      cards[i].childNodes[1].style.height = '231px'
    }
  }
}
