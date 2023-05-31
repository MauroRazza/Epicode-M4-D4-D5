const url = "https://striveschool-api.herokuapp.com/books"

window.onload = () => {
  fetchBooks()
}
const fetchBooks = () => {
  fetch(url)
    .then((raw) => raw.json())
    .then((res) => {
      let cont = document.querySelector(".album .row")

      cont.innerHTML = res
        .map((book) => {
          return `<div class='col col-3'> 
          <div class="card mb-4 shadow-sm" id='book_${book.asin}'>
                <img class="img-fluid" src='${book.img}' />
                <div class="card-body d-flex flex-column">
                  <p class='font-weight-bold text-truncate book-title'> ${book.title} </p>
                  <div>
                    <button class='btn m-1 btn-primary' onclick="addToCart('${book.title}', '${book.price}', '${book.asin}')"> EUR ${book.price} </button>
                    <button class='btn m-1 btn-info' onclick="showDetails('${book.asin}')"> Dettagli </button>
                    <button class='btn m-1 btn-secondary' onclick='skipBook(event)'> Salta </button>
                  </div>
                </div>
              </div> 
              </div>`
        })
        .join("")
    })
    .catch((err) => console.error(err))
}

const addToCart = (title, price, asin) => {
  const book = document.querySelector("#book_" + asin)
  book.style.background = "green"
  const cart = document.querySelector(".list-group")
  cart.innerHTML += `
  <li class="list-group-item text-white bg-success border-0 my-1">${title}, ${price} 
  <button class='btn btn-danger' onclick='removeFromCart(event, "${asin}", "${price}")'> X </button></li>
  
  `
  const totale = document.querySelector("h5 span")
  totale.innerText = (Number(totale.innerText) + Number(price)).toFixed(2)
}

const searchBook = (ev) => {
  let query = ev.target.value
  let allTitles = document.querySelectorAll(".book-title")
  console.log(
    query,
    allTitles[0].innerText.toLowerCase().includes(query.toLowerCase())
  )
  allTitles.forEach((title) => {
    const currCard = title.parentElement.parentElement.parentElement
    if (!title.innerText.toLowerCase().includes(query.toLowerCase())) {
      currCard.style.display = "none"
    } else {
      currCard.style.display = "block"
    }
  })
}

const removeFromCart = (event, asin, price) => {
  event.target.closest("li").remove()
  const totale = document.querySelector("h5 span")
  totale.innerText = (Number(totale.innerText) - Number(price)).toFixed(2)
  const book = document.querySelector("#book_" + asin)
  book.style.background = "white"
}

const emptyCart = () => {
  document.querySelector(".list-group").innerHTML = ""
  document.querySelectorAll(".card").forEach(card => {
    card.style.display = "block"
    card.style.background = "white"
  })
  const totale = document.querySelector("h5 span")
  totale.innerText = "0"
}

const skipBook = (event) => {
  const card = event.target.closest('.card')
  card.style.display = 'none'
}

const showDetails = (bookId) => {
  const url = new URL('book-details.html', window.location.origin)
  url.searchParams.append('id', bookId)
  window.location.href = url
}

const urlParams = new URLSearchParams(window.location.search)
const bookId = urlParams.get('id')

fetch(`https://striveschool-api.herokuapp.com/books/${bookId}`)
  .then(response => response.json())
  .then(book => {
    const bookDetailsContainer = document.querySelector('#book-details')
    bookDetailsContainer.classList.add('d-flex', 'py-5')

    const imageElement = document.createElement('img')
    imageElement.src = book.img
    imageElement.classList.add('img-fluid')
    imageElement.style = 'height:500px'
    bookDetailsContainer.appendChild(imageElement)

    const bookDiv = document.createElement('div')
    bookDiv.classList.add('d-flex', 'flex-column', 'px-5')

    const titleElement = document.createElement('h1')
    titleElement.innerText = book.title
    titleElement.classList.add('h1')
    bookDiv.appendChild(titleElement)

    const priceElement = document.createElement('h2')
    priceElement.innerText = `Price: ${book.price}`
    bookDiv.appendChild(priceElement)

    const categoryElement = document.createElement('h3')
    categoryElement.innerText = `Category: ${book.category}`
    bookDiv.appendChild(categoryElement)

    bookDetailsContainer.appendChild(bookDiv)
  })


