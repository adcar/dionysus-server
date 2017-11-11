window.addEventListener('load', function () {
  // Truncate function
  const truncate = (string, length) => {
    if (string.length > length) {
      return string.substring(0, length - 1) + '...'
    } else {
      return string
    }
  }

  var titles = document.querySelectorAll('.card-title')
  for (let i = 0; i < titles.length; i++) {
    // This sets the title HTML attribute, so you can hover over and see it. (Plus accessibility) Not to be confused with the card "title". (Which isn't a HTML title attribute... yeah... title)
    titles[i].setAttribute('title', titles[i].innerHTML)

    // This actually truncates using the function above.
    titles[i].innerHTML = truncate(titles[i].innerHTML, 15)
  }

  var links = document.querySelectorAll('.source')
  for (let i = 0; i < links.length; i++) {
    // This sets the title HTML attribute, so you can hover over and see it. (Plus accessibility)
    links[i].setAttribute('title', links[i].innerHTML)

    // This actually truncates using the function above.
    links[i].innerHTML = truncate(links[i].innerHTML, 37)
  }
})
