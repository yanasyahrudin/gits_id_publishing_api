const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { Author, Publisher, Book } = require('../models');

// get all books
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        { model: Author, as: 'author' },
        { model: Publisher, as: 'publisher' }
      ]
    });
    res.json(books);
  } catch (err) {
    console.log(err.message);
  }
});

// get book by id
router.get('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        { model: Author, as: 'author' },
        { model: Publisher, as: 'publisher' }
      ]
    });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    console.log(err.message);
  }
});

// add new book
router.post('/', auth, async (req, res) => {
  try {
    const { title, authorId, publisherId } = req.body;
    if (!title || !authorId || !publisherId) return res.status(400).json({ message: 'title, authorId and publisherId required' });

    const author = await Author.findByPk(authorId);
    if (!author) return res.status(400).json({ message: 'Invalid authorId' });
    const publisher = await Publisher.findByPk(publisherId);
    if (!publisher) return res.status(400).json({ message: 'Invalid publisherId' });

    const book = await Book.create({ title, authorId, publisherId });
    res.json(book);
  } catch (err) {
    console.log(err.message);
  }
});

// edit book
router.put('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const { title, authorId, publisherId } = req.body;
    if (authorId) {
      const author = await Author.findByPk(authorId);
      if (!author) return res.status(400).json({ message: 'Invalid authorId' });
    }
    if (publisherId) {
      const publisher = await Publisher.findByPk(publisherId);
      if (!publisher) return res.status(400).json({ message: 'Invalid publisherId' });
    }

    await book.update({ title, authorId, publisherId });
    res.json(book);
  } catch (err) {
    console.log(err.message);
  }
});

// delete book
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    await book.destroy();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;