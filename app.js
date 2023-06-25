// importing modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const port = 3000;
const app = express();
const fs = require("fs");

// reading file content
const content = JSON.parse(
  fs.readFileSync(__dirname + "/data.json").toString()
);
const posts = JSON.parse(fs.readFileSync(__dirname + "/posts.json").toString());
const homeText = content.homeText;
const contactText = content.contactText;
const aboutText = content.aboutText;

// configurations
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//get requests
app.get("/", (req, res) => res.render("home.ejs", { homeText }));
app.get("/contact", (req, res) => res.render("contact.ejs", { contactText }));
app.get("/about", (req, res) => res.render("about.ejs", { aboutText }));
app.get("/posts", (req, res) => res.render("post.ejs", { posts, _ }));
app.get("/compose", (req, res) => res.render("compose.ejs"));
// each blogs
app.get("/posts/:post", (req, res) => {
  let reqPost = req.params.post;
  let postExists = false;
  for (let post in posts) {
    if (reqPost === _.kebabCase(_.lowerCase(post))) {
      postExists = true;
      res.render("content", { title: post, content: posts[post] });
    }
  }
  if (!postExists) {
    res.render("error");
  }
});

// post requests
app.post("/", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  posts[title] = content;
  fs.writeFileSync(__dirname + "/posts.json", JSON.stringify(posts));
  setTimeout(() => {
    res.redirect("/posts");
  }, 500);
});
// going live
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
