const { Router } = require("express");
const router = new Router();

const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const Game = require("../models/Game.model");
const saltRounds = 10;

// GET route ==> to display the signup form to users
router.get("/signup", (req, res, next) => {
	res.render("auth/signup.hbs");
});
// POST route ==> to process form data
router.post("/signup", (req, res, next) => {
	const { username, email, password } = req.body;

	bcryptjs
		.genSalt(saltRounds)
		.then((salt) => bcryptjs.hash(password, salt))
		.then((hashedPassword) => {
			return User.create({
				username,
				email,
				password: hashedPassword,
			});
		})
		.then((createdUser) => {
			console.log("Hello new user: ", createdUser);
			res.redirect("/");
		})
		.catch((error) => next(error));
});
// GET route ==> to display login form to users
router.get("/login", (req, res, next) => {
	res.render("auth/login.hbs");
});
// POST route ==> to process form data
router.post("/login", (req, res, next) => {
	const { username, password } = req.body;
	User.findOne({ username })
		.then((user) => {
			console.log(user);
			console.log(req.session);
			bcryptjs.compareSync(password, user.password);
			req.session["currentUser"] = user;
			console.log(req.session);
			res.redirect("/userProfile");
		})
		.catch((error) => next(error));
});

router.get("/logout", (req, res, next) => {
	console.log(req.session, "first");
	req.session.destroy((error) => {
		if (error) {
			next(error);
		}
		console.log(req.session, "second");
		res.redirect("/");
	});
});

router.get("/userProfile", (req, res, next) => {
	User.findById(req.session.currentUser._id)
		.populate("gamesArray")
		.then((response) => {
			console.log(response.gamesArray, "hello");
			res.render("users/user-profile", {
				gameList: response.gamesArray,
				userSession: req.session.currentUser,
			});
		});
});

router.get("/gameDelete/:id/delete", (req, res, next) => {
	const { id } = req.params;
	Game.findByIdAndDelete(id)
		.then((response) => {
			console.log(response);
			User.findByIdAndUpdate(
				req.session.currentUser._id,
				{
					$pull: { gamesArray: response._id },
				},
				{ new: true }
			).then((updatedUser) => console.log(updatedUser));
			res.redirect("/userProfile");
		})
		.catch((error) => next(error));
});

module.exports = router;
