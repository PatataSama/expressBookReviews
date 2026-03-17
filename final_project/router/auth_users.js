const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid (exists in the users array)
const isValid = (username)=>{ 
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
}

// Check if username and password match the ones we have in records
const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
}

// Task 7: Only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in. Please provide username and password."});
  }

  if (authenticatedUser(username, password)) {
    // Generate JWT token
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 }); // Token expires in 1 hour

    // Save token and username to session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review; // Getting review from request query
  const username = req.session.authorization.username; // Getting username from session

  if (books[isbn]) {
    // If the review object doesn't exist for the book, create it
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }
    
    // Add or modify the review for the specific user
    books[isbn].reviews[username] = review;
    
    return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated by user ${username}.`);
  } else {
    return res.status(404).json({message: "Book not found."});
  }
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    // Check if the user has a review for this book
    if (books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username]; // Delete only this user's review
        return res.status(200).send(`Review for the book with ISBN ${isbn} posted by the user ${username} deleted.`);
    } else {
        return res.status(404).json({message: "Review not found for this user."});
    }
  } else {
    return res.status(404).json({message: "Book not found."});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;