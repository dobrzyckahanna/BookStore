const express = require('express');
const router = express.Router();
const { Book, validateBook, validateComment } = require('../models/book');
const mongoose = require('mongoose');

// Book add form
router.get('/add', async (req, res) => {
  res.render('addBookForm');
});

// Add book
router.post('/add', async (req, res) => {
  const { error } = validateBook(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishingYear: req.body.publishingYear,
    category: req.body.category,
    description: req.body.description
  });
  await book.save();

  res.redirect('/api/books');
});

// Books list
router.get('/', async (req, res) => {
  const books = await Book.find().sort('title');

  res.render('booksList', {
    books: books
  });
});

//Book view
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send('The book with the given ID was not found');

  let sum = 0;
  for (let rating of book.reviewsList) {
    sum += rating.stars;
  }
  const calculation = (sum / book.reviewsList.length).toFixed(2);
  const averageStars = isNaN(calculation) ? 'Waiting for your comment' : calculation;

  res.render('bookView', {
    book: book,
    averageStars: averageStars
  });
});

//Delete book
router.delete('/:id', async (req, res) => {
  const book = await Book.findByIdAndRemove(req.params.id);

  if (!book) return res.status(404).send('The book with the given ID was not found');

  res.send('Success');
})

//Edit book form
router.get('/edit/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) return res.status(404).send('The book with the given ID was not found');

  res.render('editBookForm', {
    book: book
  });
});

// Edit book
router.post('/edit/:id', async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const book = await Book.findByIdAndUpdate(req.params.id,
    {
      title: req.body.title,
      author: req.body.author,
      publishingYear: req.body.publishingYear,
      category: req.body.category,
      description: req.body.description
    }
  );
  if (!book) return res.status(404).send('The book with the given ID was not found');

  res.redirect('/api/books/'+ book._id);
});

// Add comment and ratings
router.post('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send('The book with the given ID was not found');

  const { error } = validateComment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const dateNow = new Date().toISOString().slice(0, 10);
  const timeNow = new Date().toISOString().slice(11, 16);

  book.reviewsList.unshift({
    comment: req.body.comment,
    stars: req.body.stars,
    date: `${dateNow} ${timeNow}`
    //user: req.body.user_id -> it should be added from token (auth middleware)
  });

  await book.save();

  res.redirect('/api/books/'+ book._id);
});


module.exports = router;
