const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("../data/booksdb.js");
const regd_users = express.Router();

let users = [];

function isValid(username){
   return !users.some(u => u.username === username);
}

const authenticatedUser = (username,password)=>{
  return users.some(u => u.username === username && u.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      req.session.user = { username };  // or: const token = jwt.sign({ username }, "secret");
      return res.status(200).json({ message: "Login successful." });
    } else {
      return res.status(401).json({ message: "Invalid username or password, unable to login." });
    }
  } else {
    return res.status(400).json({ message: "Invalid username or password, unable to login." });
  }
});


// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const review = req.query.review;
  const username = req.session.user.username;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (books[isbn]) {
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review successfully added/updated", reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// deleting a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const username = req.session.user.username;

  if (books[isbn]) {
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Your review has been deleted." });
    } else {
      return res.status(404).json({ message: "Your review not found for this book." });
    }
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
