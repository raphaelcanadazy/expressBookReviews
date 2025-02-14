const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(books);
});

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

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
