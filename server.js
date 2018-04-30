var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/web-scraper");

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {

  //load up var or web site to scrape, will also be reused in URLs for image & story link for the scraped article
  var urlToScrape = "http://www.chicagotribune.com";

  // First, we grab the body of the html with request
  axios.get(urlToScrape).then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every 'article' within an article tag, and do the following:
    $("section.trb_outfit_sections").each(function (i, element) {
      // Save an empty result object
      var result = {};

      console.log("inside of .each");
      // Add the text and href of every link, and save them as properties of the result object
      // result.title = $(this)
      //   .children(".trb_outfit_primaryItem_article_title")
      //   .text();
      result.title = $(this)
        .find("h2")
        .text();

      if (result.title != "") {
        result.summary = $(this)
          .find(".trb_outfit_primaryItem_article_content")
          .text();
        result.section = $(this)
          .find(".trb_outfit_categorySectionHeading a")
          .text();
        result.articleLink = urlToScrape + $(this)
          .find(".trb_outfit_categorySectionHeading a")
          .attr("href");
        result.articleImageLink = $(this)
          .find("figure img")
          .attr("data-baseurl");
        result.articleImageAlt = $(this)
          .find("figure img")
          .attr("alt");
        result.articleImageTitle = $(this)
          .find("figure img")
          .attr("title");

        console.log("just before db.Article.find", result)
        // If query IS passed into .find(), filters by the query parameters
        db.Article.find({ title: result.title }, (err, articleFound) => {
          if (err)
            console.log()
          // return res.status(500).send(err);
          console.log("inside article find");
          console.log(articleFound[0]);

          if (articleFound[0] == undefined) {

            console.log("inside article =[]");
            console.log(result);

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
              .then(function (dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
              })
              .catch(function (err) {
                // If an error occurred, send it to the client
                return res.json(err);
              });
          }
        });
      }

    });

    // Now, we grab every '.trb_outfit_group_list_item' within an article tag, and do the following:
    $("li.trb_outfit_group_list_item").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .find("h3")
        .text();

      console.log("in li.trb_outfit loop");
      console.log(result.title);

      if (result.title != "") {
        result.summary = $(this)
          .find(".trb_outfit_group_list_item_brief")
          .text();
        result.section = $(this)
          .find(".trb_outfit_categorySectionHeading a")
          .text();
        result.articleLink = urlToScrape + $(this)
          .find(".trb_outfit_categorySectionHeading a")
          .attr("href");
        result.articleImageLink = $(this)
          .find("img")
          .attr("data-baseurl");
        result.articleImageAlt = $(this)
          .find("img")
          .attr("alt");
        result.articleImageTitle = $(this)
          .find("img")
          .attr("title");

        // If query IS passed into .find(), filters by the query parameters
        db.Article.find({ title: result.title }, (err, articleFound) => {
          if (err)
            // return res.status(500).send(err);
            if (articleFound[0] == undefined) {

              console.log(articleFound[0]);

              // Create a new Article using the `result` object built from scraping
              db.Article.create(result)
                .then(function (dbArticle) {
                  // View the added result in the console
                  console.log(dbArticle);
                })
                .catch(function (err) {
                  // If an error occurred, send it to the client
                  return res.json(err);
                });
            }
        });
      }
    });
    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // TODO: Finish the route so it grabs all of the articles
  // Find all Notes
  db.Article.find({})
    .then(function (dbArticle) {
      // If all Notes are successfully found, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.find({ _id: req.params.id })
    // Specify that we want to populate the retrieved Articles with any notes
    .populate("note")
    .then(function (dbUserNotes) {
      // If any Articles are found, send them to the client with any notes
      res.json(dbUserNotes);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });


});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      console.log("dbNote:", dbNote);
      console.log("req.params", req.params)
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
    })
    .then(function (dbNote) {
      // If the User was updated successfully, send it back to the client
      res.json(dbNote);
    })
    .catch(function (err) {
      console.log("in .catch");
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});

// Route for getting all Articles from the db
app.delete("/notes/:id", function (req, res) {

  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.remove({ _id: req.params.id })
    .then(function (dbNote) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      console.log("dbNote:", dbNote);
      console.log("req.params", req.params)
      return db.Article.findOneAndRemove({ _id: req.body.id }, { $pull: { note: req.params.id } }, { new: true });
    })
    .then(function (dbNote) {
      // If the User was updated successfully, send it back to the client
      res.json(dbNote);
    })
    .catch(function (err) {
      console.log("in .catch");
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

