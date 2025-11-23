const express = require('express');
const router  = express.Router();
const Contact = require('../models/Contact');
const { name } = require('ejs');

// GET home - list contacts + search

router.get('/', async (req, res) => {
  try {
    const q = req.query.q || '';
    const filter = q ? { name: { $regex: q, $options: 'i' } } : {};
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.render('index', { contacts, q });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//post create contact

router.post('/contacts', async (req, res) => {
    try {
        const { name, email,phone} = req.body;
        if(!name) {
            // simple validation
            return res.redirect('/');
        }
        await Contact.create({name,email,phone});
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete contact

router.delete('/contacts/:id', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports =router;