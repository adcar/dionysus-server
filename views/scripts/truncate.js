window.addEventListener('load', function () {
  const truncate = (string) => {
    if (string.length > 19) {
      return string.substring(0, 19) + '...'
    } else {
      return string
    }
  }
  var titles = document.querySelectorAll('.card-title')
  for (let i = 0; i < titles.length; i++) {
    // This sets the title HTML attribute, so you can hover over and see it. (Plus accessibility)
    titles[i].setAttribute('title', titles[i].innerHTML)

    // This actually truncates using the function above.
    titles[i].innerHTML = truncate(titles[i].innerHTML)
  }
})
