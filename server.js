const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Book = require('./models/book');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/bookdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.render('add-book');
});

app.post('/add-book', async (req, res) => {
    const newBook = new Book(req.body);
    await newBook.save();
    res.redirect('/all-books');
});

app.get('/all-books', async (req, res) => {
    const books = await Book.find();
    res.render('all-books', { books });
});

app.get('/edit/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render('edit-book', { book });
});

app.post('/update/:id', async (req, res) => {
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/all-books');
});

app.get('/delete/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/all-books');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});