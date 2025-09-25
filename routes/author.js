const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { Author, Book } = require('../models');

// get all authors
router.get('/', auth, async (req, res) => {
  try {
    const authors = await Author.findAll({ include: { model: Book, as: 'books' } });
    res.json(authors);
  } catch (err) {
    console.log(err.message);
  }
});

// get author by id
router.get('/:id', auth, async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id, { include: { model: Book, as: 'books' } });
    if (!author) return res.status(404).json({ message: 'Author not found' });
    res.json(author);
  } catch (err) {
    console.log(err.message);
  }
});

// add new author
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const author = await Author.create({ name });
    res.json(author);
  } catch (err) {
    console.log(err.message);
  }
});

// edit author
router.put('/:id', auth, async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (!author) return res.status(404).json({ message: 'Author not found' });
    await author.update({ name: req.body.name });
    res.json(author);
  } catch (err) {
    console.log(err.message);
  }
});

// delete author
router.delete('/:id', auth, async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (!author) return res.status(404).json({ message: 'Author not found' });
    await author.destroy();
    res.json({ message: 'Author deleted' });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;    