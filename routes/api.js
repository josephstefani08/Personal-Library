/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const BookModel = require('../models/BookModel.js')
// const MONGODB_CONNECTION_STRING = process.env.DB;
mongoose.connect(process.env.DB, {useNewUrlParser: true})/*, (err, db) => {
  console.log("Connected to database.");
});*/
mongoose.set('useFindAndModify', false);
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get((req, res) => {
      // I can get /api/books to retrieve an aray of all books containing title, _id, & commentcount.
      // Seems to work fine
      BookModel.find({}, (error, books) => {
        let theBooks = [];
        if(error) {
          res.send('Error occurred');
          return;
        }
        // For every book returned, make an object and once done, send that
        books.forEach(book => {
          theBooks.push(
            {_id: book._id, title: book.title, commentcount: book.comments.length});
        });
        res.json(theBooks);
      });
    })
    
    // Seems to work fine
    .post(function (req, res){
      let title = req.body.title;
      let bookToAdd = new BookModel({
        title: title
      })
      if(title == '') {
        res.send('Please enter a book')
        return;
      }
      bookToAdd.save().then(newBook => {
        res.json({_id: newBook._id, title: newBook.title});
      });
    })
    
    // Seems to work fine
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      BookModel.deleteMany({}, (error, book) => {
        res.send('Complete delete successful');
      });
    });



  app.route('/api/books/:id')
  
    // Seems to work fine
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      BookModel.findById({_id: bookid}, (error, book) => {
        if(error) {
          res.send('No book exists');
          return;
        }
        res.json({_id: bookid, title: book.title, comments: book.comments});
      });
    })
    
    // Seems to work fine
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      BookModel.findOneAndUpdate({_id: bookid}, {$push: {comments: comment}}, (error, book) => {
        if(error) {
          res.send('No book exists');
        }
        res.json({_id: bookid, title: book.title, comments: comment});
      })
    })
    
    // Seems to work fine
    .delete(function(req, res){
      let bookid = req.params.id;
      BookModel.findOneAndDelete({_id: bookid}, (error, book) => {
        if(error) {
          res.send('Delete not successful');
        }
        res.send('Delete successful');
      })
    });
  
};
