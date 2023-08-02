//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { startsWith } = require("lodash");
const https = require("https");
const request = require("request");
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const app = express();
const apiKey = process.env.API_KEY;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongoDB starts

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

const postSchema = {
	title: String,
	author: String,
	content: String,
};

const Post = mongoose.model("Post", postSchema);

// mongoDB ends

var posts = [];

//  navbar starts

app.get("/", function (req, res) {
	Post.find({}, function (err, posts) {
		res.render("home", { posts: posts });
	});
});

app.get("/contact", function (req, res) {
	res.render("contact");
});

app.get("/about", function (req, res) {
	res.render("about");
});

app.get("/compose", function (req, res) {
	res.render("compose");
});

app.post("/compose", function (req, res) {
	const post = new Post({
		title: req.body.postTitle,
		author: req.body.postAuthor,
		content: req.body.postBody,
	});

	post.save();

	res.redirect("/");
});

app.get("/sucess", function (req, res) {
	res.render("sucess");
});
app.get("/failure", function (req, res) {
	res.render("failure");
});

// navbar ends

// publish starts

app.post("/compose", function (req, res) {
	const post = {
		title: req.body.postTitle,
		author: req.body.postAuthor,
		content: req.body.postBody,
	};

	posts.push(post);
	res.redirect("/");
});

app.get("/posts/:postId", function (req, res) {
	const requestedPostId = req.params.postId;

	Post.findOne({ _id: requestedPostId }, function (err, post) {
		res.render("post", {
			title: post.title,
			author: post.author,
			content: post.content,
		});
	});
});

// publish ends

// Contact form starts

app.post("/contact", function (req, res) {
	const email = req.body.email;

	var data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
			},
		],
	};

	var jsonData = JSON.stringify(data);

	const url = "https://us13.api.mailchimp.com/3.0/lists/5ab3f35274";
	const options = {
		method: "post",
		auth: `user:${apiKey}`,
	};

	const request = https.request(url, options, function (response) {
		if (response.statusCode === 200) {
			res.redirect("/sucess");
		} else {
			res.redirect("/failure");
		}
		// response.on("data",function(data){
		//     console.log(JSON.parse(data));
		// })
	});

	request.write(jsonData);
	request.end();
});

// contactform ends

app.listen(3000, function () {
	console.log("Server started on port 3000");
});
