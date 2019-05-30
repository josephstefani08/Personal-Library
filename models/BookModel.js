const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining schema
let bookSchema = new mongoose.Schema({
  title: {type: String, required: true},
  comments: []
});

module.exports = mongoose.model('book', bookSchema);