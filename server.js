var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require('axios');
var request = require("request");
var cheerio = require("cheerio");

var app = express();

//Requiring MongoDB collections
var Article = require("./models/Article.js");
var Notes = require("./models/Notes.js");

app.use(bodyParser.urlencoded({ extended: false }));


//making public static directory
app.use(express.static(process.cwd() + "/public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.Promise = Promise;
var databaseUri = 'mongodb://localhost/news';

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri, {
    useMongoClient: true
  })
}

var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose error at " + error);
})

db.once("open", function(){
    console.log("Mongoose connections successful");
})

app.get("/", function(req, res) {
  
  axios.get("http://bleacherreport.com/").then(function(response){
    var $ = cheerio.load(response.data); 
    var results = [];
  
    $(".articleSummary").each(function(i, element) {

      results.push({
        title: $(element).children('.articleContent').children('a').children('h3').text(),
        image: $(element).children('.articleMedia').children('a').children('img').attr('src'),
        link: $(element).children('.articleMedia').children('a').attr('href')
      })
    })
    return results;
  })
  .then((results) => {
    res.render('index', {results: results});
  })
})

app.post('/save', function(req, res) {
  var posts = req.body;
  var title = posts.title;
  var link = posts.link;
  var date = posts.date;
  console.log(posts.title);
  console.log(posts.link);
  console.log(posts.date);
  return Article.create(
    posts, {
      upsert: true,
      multi: false,
    }
  ).then(function(err, res){
    if (err) throw err;
    res.json('woohoo');
  }).catch(function(err) {
    if (err) throw err;
  })
})

app.get("/saved", function (req, res){
  Article.find({})
  .sort('-date')
  .exec(function(err, data){
       var hbsObject = {
        article: data
      }
      res.render("saved", hbsObject);
  })
})

app.delete('/delete', function(req, res) {
  var deleted = req.body
  var id = req.body.id
  console.log(id);
  Article.findById({_id: id}).remove(function(err, result){
    console.log("deleted");
    var response = {
      message: "Successfully deleted",
    } 
  })
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});








