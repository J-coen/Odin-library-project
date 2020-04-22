// DOM elements
const showModal = document.getElementById('add-btn');
const tableBody = document.getElementById('table-body');
const table = document.getElementById('table');
const titleInput = document.getElementById('book-title');
const authorInput = document.getElementById('book-author');
const pagesInput = document.getElementById('pages');
const readInput = document.getElementById('read');
const submit = document.getElementById('submit-btn');
const formCon = document.querySelector('.form-container');
const closeBtn = document.getElementById('close');
const markRead = document.querySelectorAll('.mark-read-btn');

// Library array to store books
let library = [];

// Book constructor
function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// Book info method
Book.prototype.info = function() {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`;
}

// Add books to library array
function addBookToLibrary(...book) {
  library.push(...book);
}

// Books to have displayed 
const harrypotter = new Book('East Of Eden', 'John Steinbeck', 601, false);
const oneFlew = new Book('One Flew Over the Cuckoo\'s Nest', 'Ken Kesey', 325, false);
const lordRing = new Book('Fight Club', 'Chuck Palahniuk', 218, true);

// Add static books to library
addBookToLibrary(harrypotter, oneFlew, lordRing);

// Display all books from library
function displayBooks() {
    // Check books in Local storage
    if(JSON.parse(localStorage.getItem('books')) === null) {
      return [];
    }
    // Get items from LS
    library = JSON.parse(localStorage.getItem('books'));

    library.forEach(item => {
      const row = document.createElement('tr');
      row.dataset.position = library.indexOf(item);
      row.innerHTML = `
        <td>${item.title}</td>
        <td>${item.author}</td>
        <td>${item.pages}</td>
        <td>${item.read === true ? "Read" : "Unread"}</td>
        <button class="${item.read === true ? "mark-read-btn have-read" : "mark-read-btn"}">${checkRead(item.read)}</button>
        <button class="delete-book" id="delete-book">X</button>
      `;
      tableBody.appendChild(row);
    });
    
}


// Display user input book
function displayUserBook() {

  // Get user added book
  const userBookAdded = library[library.length - 1];
  
  const row = document.createElement('tr');
      row.dataset.position = library.indexOf(userBookAdded);
      row.innerHTML = `
        <td>${userBookAdded.title}</td>
        <td>${userBookAdded.author}</td>
        <td>${userBookAdded.pages}</td>
        <td>${userBookAdded.read === "true" ? "Read" : "Unread"}</td>
        <button class="${userBookAdded.read === "true" ? "mark-read-btn have-read" : "mark-read-btn"}" id="mark-read-btn">${checkRead(userBookAdded.read)}</button>
        <button class="delete-book" id="delete-book">X</button>
        `;
        tableBody.appendChild(row);

        // Set status of book read 
        if(userBookAdded.read === 'true') {
          userBookAdded.read = true;
        } else {
          userBookAdded.read = false;
        }

}

// Save items in local storage
function updateLocalStorage(book) {
  localStorage.setItem('books', JSON.stringify(book));
}


// Check if book has been read then update button text (on initial load)
function checkRead(hasItBeenRead) {
  if(hasItBeenRead === true || hasItBeenRead === 'true') {
    return "Mark unread";
  } else {
    return "Mark read";
  }
}

// Close input form
function closeForm() {
    formCon.classList.remove('show');
}

// Delete book
function deleteBook(e) {
  // Get posiiton of book to delete using dataset
  const positionOfDeleteItem = e.target.parentElement.dataset.position;
  
  if(e.target.className === 'delete-book') {
    // Remove row
    e.target.parentElement.remove();
    // Remove from library array
    library.splice(positionOfDeleteItem, 1);
    updateLocalStorage(library);
  }
}

// Clear input fields
function clearFields() {
  titleInput.value = '';
  authorInput.value = '';
  pagesInput.value = '';
  readInput.value = '';
}

// Show book as read after read button clicked
function showBookAsRead(e) {
  // Get text in read column
  let readText = e.target.parentElement.cells[3];

  // Get position of book to mark read
  const positionOfMarkRead = e.target.parentElement.dataset.position;
  // Check if book has been read and update status if changed
  library[positionOfMarkRead].read === true ? library[positionOfMarkRead].read = false : library[positionOfMarkRead].read = true;
  // Update text in read? and mark read button
  readText.innerText === 'Read' ? readText.innerText = 'Unread' : readText.innerText = 'Read';
  readText.innerText === 'Unread' ? e.target.innerText = 'Mark read' : e.target.innerText = 'Mark unread';

  updateLocalStorage(library);
}


// Event listeners

// Submit event
submit.addEventListener('click', (e) => {
  e.preventDefault();
  const title = titleInput.value;
  const author = authorInput.value;
  const pages = pagesInput.value;
  const read = readInput.value;

  const inputBook = new Book(title, author, pages, read);
  
  addBookToLibrary(inputBook);

  closeForm();

  displayUserBook();

  clearFields(); 

  // Set items in local storage
  updateLocalStorage(library);
});

showModal.addEventListener('click', () => formCon.classList.add('show') );

closeBtn.addEventListener('click', closeForm);

// Delete button event
window.addEventListener('click', deleteBook);

// Read button event
window.addEventListener('click', (e) => {

  if(e.target.className === 'mark-read-btn' || e.target.className === 'mark-read-btn have-read') {
    showBookAsRead(e);
    e.target.classList.toggle('have-read');
  }
});


// Init display stored books
displayBooks();
