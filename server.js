//connects to local server 
//scrapes bleacher report 

//scrape stories from bleacher report 
//should include link to story, headline, and thumbnail/image 
//cheerio to grab site content and mongoose to save it to mongodbdatabase


//dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


//scraping tools
var request = require("request");
var cheerio = require("cheerio");

var app = express();

var Article = require("./models/Article.js");
var Notes = require("./models/Notes.js");

app.use(bodyParser.urlencoded({ extended: false }));


//making public static dir
app.use(express.static(process.cwd() + "/public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//database configuration with mongoose
mongoose.connect("mongodb://localhost/news")
var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose errore at " + error);
})

db.once("open", function(){
    console.log("Mongoose connections successful");
})

app.get("/", function (req, res) {
  Article.find({}, function runScrape (err, data) {
    var hbsObject = {
        article: data
      }
      res.render("index", hbsObject);
    })
  })

app.get("/scrape", function(req, res) {

  request("http://bleacherreport.com//", function(err, res, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape
    var result = {};

    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $("a.articleTitle").each(function(i, element) {

      var result = {};
      result.title = $(this).children('h3').text();
      result.link = $(this).attr('href');

      var entry = new Article(result);
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      }) 
    });

    // Log the result once cheerio analyzes each of its selected elements
  })
   res.send("Scrape complete");
});

app.get("/articles", function (err, res){
  Article.find({}, function(err, doc){
    if (err) {
      throw err
    } else {
      res.json(doc);
    }
  })
});

// app.get("/articles/:id", function (req, res){
//   Article.findOne({_id: req.params.id}) 
//     .populate("note")
//     .exec(function(error, doc) {
//       if (err) {
//         console.log(err)
//       } else {
//         res.json(doc);
//       }
//     })
//   });

app.listen(3360, function(){
    console.log("listening");
})








