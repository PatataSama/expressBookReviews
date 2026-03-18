const express = require('express');
const axios = require('axios'); // Added Axios for Tasks 10-13
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required."});
  }

  const doesExist = users.filter((user) => user.username === username).length > 0;
  
  if (doesExist) {
    return res.status(409).json({message: "Username already exists."});
  } else {
    users.push({username: username, password: password});
    return res.status(200).json({message: "User successfully registered. You can now log in."});
  }
});

// Task 10: Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
      resolve(books);
  });

  getBooks.then((bookList) => {
      return res.status(200).send(JSON.stringify(bookList, null, 4));
  }).catch((error) => {
      return res.status(500).json({message: "Error retrieving books."});
  });
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  const getBookByIsbn = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
          resolve(book);
      } else {
          reject("Book not found.");
      }
  });

  getBookByIsbn.then((book) => {
      return res.status(200).json(book);
  }).catch((error) => {
      return res.status(404).json({message: error});
  });
});
  
// Task 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  const getBooksByAuthor = new Promise((resolve, reject) => {
      const booksByAuthor = [];
      const keys = Object.keys(books);
      
      keys.forEach(key => {
          if (books[key].author === author) {
              booksByAuthor.push({isbn: key, ...books[key]});
          }
      });
      
      if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
      } else {
          reject("No books found for this author.");
      }
  });

  getBooksByAuthor.then((result) => {
      return res.status(200).json({booksbyauthor: result});
  }).catch((error) => {
      return res.status(404).json({message: error});
  });
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  
  const getBooksByTitle = new Promise((resolve, reject) => {
      const booksByTitle = [];
      const keys = Object.keys(books);
      
      keys.forEach(key => {
          if (books[key].title === title) {
              booksByTitle.push({isbn: key, ...books[key]});
          }
      });
      
      if (booksByTitle.length > 0) {
          resolve(booksByTitle);
      } else {
          reject("No books found with this title.");
      }
  });

  getBooksByTitle.then((result) => {
      return res.status(200).json({booksbytitle: result});
  }).catch((error) => {
      return res.status(404).json({message: error});
  });
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found."});
  }
});

module.exports.general = public_users;


// =================================================================
// AXIOS CLIENT REQUESTS (For Grading Rubric Sub-Questions 1-4)
// =================================================================

// Task 10 (Axios): Get all books
const getAllBooksWithAxios = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log("Axios - All Books:", response.data);
    } catch (error) {
        console.error("Error fetching all books:", error);
    }
};

// Task 11 (Axios): Get book by ISBN
const getBookByISBNWithAxios = async (isbn) => {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log(`Axios - Book with ISBN ${isbn}:`, response.data);
    } catch (error) {
        console.error("Error fetching book by ISBN:", error);
    }
};

// Task 12 (Axios): Get book by Author
const getBookByAuthorWithAxios = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(`Axios - Books by ${author}:`, response.data);
    } catch (error) {
        console.error("Error fetching book by author:", error);
    }
};

// Task 13 (Axios): Get book by Title
const getBookByTitleWithAxios = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log(`Axios - Books with title ${title}:`, response.data);
    } catch (error) {
        console.error("Error fetching book by title:", error);
    }
};