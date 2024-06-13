const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  await res.send(JSON.stringify(books,null,4)); 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    await res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;
  let bookArray = Object.keys(books);
  let matchingBooks = [];
  console.log(bookArray);
  await bookArray.forEach(book => {
    if(books[book].author === author){
      matchingBooks.push(books[book]);
    }
  });
  console.log(matchingBooks.length);
  if(matchingBooks.length>0){
    res.send(JSON.stringify(matchingBooks,null,4));
  }
  else{
  res.send("No book found with this author");
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;
  let bookArray = Object.keys(books);
  let matchingBooks = [];
  console.log(bookArray);
  await bookArray.forEach(book => {
    if(books[book].title === title){
      matchingBooks.push(books[book]);
    }
  });
  console.log(matchingBooks.length);
  if(matchingBooks.length>0){
    res.send(JSON.stringify(matchingBooks,null,4));
  }
  else{
  res.send("No book found with this title");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
