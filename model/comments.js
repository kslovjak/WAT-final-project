'use strict';
//importing dependecies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of db entries.
var CommentsSchema = new Schema({
  author: String,
  text: String
});

//exporting module to use in server.js
module.exports = mongoose.model('Comment', CommentsSchema);