//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { startsWith } = require("lodash");
const https = require("https");
const request = require("request");
require("dotenv").config();

const app = express();
const apiKey = process.env.API_KEY;

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
			res.redirect("/");
		} else {
			res.redirect("/");
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
