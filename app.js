const express = require("express");
const bodyParser = require("body-Parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/WikiDB", {
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(function(req, res) {
  Article.find(function(err, result) {
    if (!err) {
      res.send(result);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save();
})

.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("Successfully deleted all article");
    } else {
      res.send(err);
    }
  });
});

app.route("/articles/:articleTitle")

.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, result){
    if(result)
    {
      res.send(result);
    }
    else
    {
      res.send("No articles matching that title is found.");
    }
  });
})

.put(function (req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set:{title: req.body.title, content: req.body.content}},
    function(err)
    {
      if(!err)
      {
        res.send("Successfully updated article.");
      }
    }
  );
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
