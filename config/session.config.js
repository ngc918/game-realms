const session = require("express-session");

const MongoStore = require("connect-mongo");

const mongoose = require("mongoose");

module.exports = (app) => {
	app.set("trust proxy", 1);
	// use session
	app.use(
		session({
			secret: process.env.session_secret,
			resave: true,
			saveUninitialized: false,
			cookie: {
				sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
				secure: process.env.NODE_ENV === "production",
				httpOnly: true,
				maxAge: 30000000, // 60 * 1000 ms === 1 min
			},
			store: MongoStore.create({
				mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/game-realm",
			}),
		})
	);
};
