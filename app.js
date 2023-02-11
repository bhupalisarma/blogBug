//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");



const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var posts = [];

//  navbar starts

app.get("/", function (req, res) {
	res.render("home", { posts: posts });
});

app.get("/contact", function (req, res) {
	res.render("contact");
});

app.get("/about", function (req, res) {
	res.render("about");
});

// navbar ends

// publish starts

app.get("/compose", function (req, res) {
	res.render("compose");
});

app.post("/compose", function (req, res) {
	const post = {
		title: req.body.postTitle,
		author: req.body.postAuthor,
		content: req.body.postBody,
	};

	posts.push(post);
	res.redirect("/");
});

app.get("/posts/:postName", function (req, res) {
	const requestedTitle = _.lowerCase(req.params.postName);

	posts.forEach(function (post) {
		const storedTitle = _.lowerCase(post.title);

		if (storedTitle === requestedTitle) {
			res.render("post", {
				title: post.title,
				author: post.author,
				content: post.content,
			});
		}
	});
});

// publish ends

app.listen(3000, function () {
	console.log("Server started on port 3000");
});
