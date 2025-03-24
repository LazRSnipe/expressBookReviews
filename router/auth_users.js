const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {};
const SECRET_KEY = "your_secret_key";

const isValid = (username) => {
    return users.hasOwnProperty(username);
};

const authenticatedUser = (username, password) => {
    return isValid(username) && users[username].password === password;
};

// User login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.status(200).json({ message: "Login successful", token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        const username = decoded.username;
        
        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        books[isbn].reviews = books[isbn].reviews || {};
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review added/updated successfully" });
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        const username = decoded.username;
        
        if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
            return res.status(404).json({ message: "Review not found" });
        }
        
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;