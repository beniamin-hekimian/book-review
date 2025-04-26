const express = require('express');
let books = require("../data/booksdb.js");
let { isValid, users } = require("./auth_users.js"); // Cleaner import

const public_users = express.Router();

// Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      return res.status(201).json({ message: "User successfully registered. Now you can login." });
    } else {
      return res.status(400).json({ message: "Username already exists, try logging in." });
    }
  } else {
    return res.status(400).json({ message: "Invalid username or password, unable to register." });
  }
});

// Get the book list available in the shop (with Promise)
public_users.get('/', async (req, res) => {
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        resolve(books);
      });
    };
    const bookList = await getBooks();
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books." });
  }
});

// Get book details based on ISBN (with Promise)
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;

    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject("Book not found");
        }
      });
    };

    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get book details based on author (with Promise)
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();

    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const matchingBooks = [];
        for (let key in books) {
          if (books[key].author.toLowerCase() === author) {
            matchingBooks.push({ isbn: key, ...books[key] });
          }
        }
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found by this author");
        }
      });
    };

    const booksByAuthor = await getBooksByAuthor(author);
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get book details based on title (with Promise)
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();

    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const matchingBooks = [];
        for (let key in books) {
          if (books[key].title.toLowerCase() === title) {
            matchingBooks.push({ isbn: key, ...books[key] });
          }
        }
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found with this title");
        }
      });
    };

    const booksByTitle = await getBooksByTitle(title);
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
