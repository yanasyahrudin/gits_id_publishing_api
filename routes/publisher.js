const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { Publisher, Book } = require('../models');

// get all publishers
router.get('/', auth, async (req, res) => {
  try {
    const pubs = await Publisher.findAll({ include: { model: Book, as: 'books' } });
    res.json(pubs);
  } catch (err) {
    console.log(err.message);
  }
});

// add new publisher
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const pub = await Publisher.create({ name });
    res.json(pub);
  } catch (err) {
    console.log(err.message);
  }
});

// get publisher by id
router.get('/:id', auth, async (req, res) => {
  try {
    const pub = await Publisher.findByPk(req.params.id, { include: { model: Book, as: 'books' } });
    if (!pub) return res.status(404).json({ message: 'Publisher not found' });
    res.json(pub);
  } catch (err) {
    console.log(err.message);
  }
});

// edit publisher
router.put('/:id', auth, async (req, res) => {
  try {
    const pub = await Publisher.findByPk(req.params.id);
    if (!pub) return res.status(404).json({ message: 'Publisher not found' });
    await pub.update({ name: req.body.name });
    res.json(pub);
  } catch (err) {
    console.log(err.message);
  }
});

// delete publisher
router.delete('/:id', auth, async (req, res) => {
  try {
    const pub = await Publisher.findByPk(req.params.id);
    if (!pub) return res.status(404).json({ message: 'Publisher not found' });
    await pub.destroy();
    res.json({ message: 'Publisher deleted' });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;