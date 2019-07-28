//Limit results

var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

//Require axios for scraping and cheerio to make DOM parsing easier
var axios = require("axios");
var cheerio = require("cheerio");

//Requires all models in models folder
var db = require("./models");

var PORT = 3000;

//Initializes express
var app = express();

//Middleware configuration

//Log requests with morgan 
app.use(logger("dev"));
//This will parse requests as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//A public static folder
app.use(express.static("public"));

//Mongo DB Connection
mongoose.connect("mongodb://localhost/mongo", { useNewUrlParser: true });

//Routes 

//GET route scrapes NYT

app.get("/scrape", function(req, res) {
    axios.get("https://www.nytimes.com").then(function(response) {
        var $ = cheerio.load(response.data);
        //Grabbing everything with an article tag
        // console.log("--------")
        // console.log(response.data)
        // console.log("--------")
        $("article").each(function(i, element) {
            
            //Empty result object where results will be pushed into
            var result = {};

            result.title = $(element).children().text();
            result.link = $(element).find("a").attr("href");

            //New article is created with the result object
            db.Article.create(result)
                .then(function(dbArticle) {
                    //Logs added result in console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
        //This message is sent to the client
        res.send("Scrape Complete");
    });
});

//Route to get all Articles from db
app.get("/articles", function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

//Route to post and update an Article's note
app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id}, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.get("/cleararticles", function(req, res) {
    db.Article.remove({}, function(error, response) {
        if (error) {
            console.log(error);
            res.send(error);
        }
        else {
            console.log(response);
            res.send(response);
        }
    });
});

app.post("/savedarticles", function(req, res) {
    console.log(req.body)
    db.Article.create(req.body)
        .then(function(dbArticle) {
            return db.SavedArticles.findOneAndUpdate({ _id: req.params.id}, { article: dbArticle._id }, { new: true });
        })
        .catch(function(err) {
            res.json(err);
        });
});




//Starts server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
