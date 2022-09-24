
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("article", articleSchema);

//////   articles route //////

app.route("/articles")
    .get(function (req, res) {
        Article.find({}, function (err, result) {
            if (!err) {
                res.send(result);
            }
            else {
                console.error(err);
            }
        })
    })
    .post(function (req, res) {


        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (err) {
                res.send(err);
            }
            else {
                res.send("successfully added new document");
            }
        });
    })

    .delete(function (req, res) {

        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send("succefully deleted all item");
            }
            else {
                res.send(err);
            }
        });

    });



//// making of specific route article ////

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, result) {
            if (!err) {
                res.send(result);
            }
            else {
                console.error(err);
            }
        });
    })
    .post(function (req, res) {

    })
    .put(function (req, res) {
        Article.findOneAndUpdate(
            { title: req.params.articleTitle },
            {
                title: req.body.title,
                content: req.body.content
            },
            { overwrite: true },
            function (err, result) {
                if (!err) {
                    res.send("Article updated successfully");

                }
                else {
                    res.send(err);
                }

            }

        )
    })
    .patch(function (req, res) {
        Article.findOneAndUpdate(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("successfukly updated articles");
                }
                else {
                    res.send(err);
                }
            }

        )

    })
    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            function (err) {
                if (!err) {
                    res.send("article deleted sussefully");
                }
                else {
                    res.send(err);
                }

            }
        )

    });



//// listening to port 8085 ////
app.listen(8085, function () {
    console.log("Server started on port 8085");
});