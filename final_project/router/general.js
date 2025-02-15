const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
        // Add the new user to the users array
        users.push({"username": username, "password": password});
        return res.status(300).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

/* For verify task10
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(books);
});
*/

// Task 10
function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}
public_users.get('/', async function (req, res) {
    try {
      const bks = await getBooks();
      res.send(JSON.stringify(bks, null, 4));
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

/* For verify task11
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(books[isbn]){
    return res.status(300).json(books[isbn]);
  }else{
    return res.status(404).json({ message: "Book not found."});
  }
 });
 */

function getByISBN(isbn) {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({status:404, message:`ISBN ${isbn} not found`});
        }
    })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    getByISBN(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
});

/* For verify task 12
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const authorInBooks = [];
  for(let book in books){
    if(books[book].author === author){
        authorInBooks.push(books[book]);
    }
  }

  if(authorInBooks.length > 0){
    return res.status(300).json(authorInBooks);
  }else{
    return res.status(404).json({ message: "Author not found."});
  }
});
*/

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
});

/* For verify task 13
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const titleInBooks = [];
  for(let book in books){
    if(books[book].title === title){
        titleInBooks.push(books[book]);
    }
  }

  if(titleInBooks.length > 0){
    return res.status(300).json(titleInBooks);
  }else{
    return res.status(404).json({ message: "Title not found."});
  }
});
*/

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  const reviews = books[isbn].reviews;
  return res.status(300).json({ reviews: reviews });
});

module.exports.general = public_users;
