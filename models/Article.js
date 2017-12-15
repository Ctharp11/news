var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    unique: true
  }, 
  date: {
    type: Number, 
    required: true
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;