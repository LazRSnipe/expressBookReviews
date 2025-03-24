const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

// Get the book list available in the shop (Task 1 & 10)
public_users.get('/', async (req, res) => {
    try {
        const bookList = JSON.stringify(books, null, 2);
        res.status(200).json(JSON.parse(bookList));
    } catch (error) {
        res.status(500).json({ message: "Error fetching book list" });
    }
});

// Get book details based on ISBN (Task 2 & 11)
public_users.get('/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
        if (books[isbn]) {
            res.status(200).json(books[isbn]);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details" });
    }
});

// Get book details based on author (Task 3 & 12)
public_users.get('/author/:author', async (req, res) => {
    const { author } = req.params;
    try {
        const bookList = Object.values(books).filter(book => book.author === author);
        if (bookList.length > 0) {
            res.status(200).json(bookList);
        } else {
            res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Get book details based on title (Task 4 & 13)
public_users.get('/title/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const bookList = Object.values(books).filter(book => book.title === title);
        if (bookList.length > 0) {
            res.status(200).json(bookList);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title" });
    }
});

// Get book review (Task 5)
public_users.get('/review/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
        if (books[isbn] && books[isbn].reviews) {
            res.status(200).json(books[isbn].reviews);
        } else {
            res.status(404).json({ message: "No reviews found for this book" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book reviews" });
    }
});

module.exports.general = public_users;