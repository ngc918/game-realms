const router = require("express").Router();
const axios = require("axios");
const { application, response } = require("express");
const Game = require("../models/Game.model");
const User = require("../models/User.model");

/* GET home page */
// router.get("/", (req, res, next) => {
// 	axios({
// 		url: "https://api.igdb.com/v4/games",
// 		method: "POST",
// 		headers: {
// 			Accept: "application/json",
// 			"Client-ID": "t4hwthrv9ka93t92dd4nlj4gm339nn",
// 			Authorization: `Bearer ${process.env.access_token}`,
// 		},
// 		data: "fields age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,cover,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_modes,genres,hypes,involved_companies,keywords,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites;",
// 	})
// 		.then((response) => {
// 			console.log(response.data);
// 			res.render("index", { games: response.data });
// 		})
// 		.catch((err) => {
// 			console.error(err);
// 		});
// });

router.get("/", (req, res, next) => {
	axios({
		url: "https://api.igdb.com/v4/games",
		method: "POST",
		headers: {
			Accept: "application/json",
			"Client-ID": "t4hwthrv9ka93t92dd4nlj4gm339nn",
			Authorization: `Bearer ${process.env.access_token}`,
		},
		data: "fields name, cover.url, summary; limit: 200;",
	})
		.then((response) => {
			//response.data.forEach((games) => console.log(games.cover.url));

			const filteredForSummary = response.data.filter(
				(individualGame) => individualGame.summary != undefined
			);

			const gamesArray = filteredForSummary.map((individualGame) => {
				if (individualGame.cover) {
					return {
						...individualGame,
						summary:
							individualGame.summary.length > 200
								? individualGame.summary.slice(0, 200) + "..."
								: individualGame.summary,
						cover: {
							...individualGame.cover,
							url: individualGame.cover.url.replace("t_thumb", "t_cover_big"),
						},
					};
				} else {
					return {
						...individualGame,
						summary:
							individualGame.summary.length > 200
								? individualGame.summary.slice(0, 200) + "..."
								: individualGame.summary,
						cover: {
							url: "https://upload.wikimedia.org/wikipedia/en/9/9a/Among_Us_cover_art.jpg",
						},
					};
				}
			});
			// console.log(response, "dfgdsgdshsgfhs");
			// console.log(response.data[0].cover.url);
			// console.log(cover_size, "hey dsfasdf sadg");
			res.render("index", { gamesArray });
		})
		.catch((err) => {
			console.error(err);
		});
});

router.get("/games/:gameId", (req, res, next) => {
	const gameId = req.params.gameId;
	console.log(req.params.gameId);
	axios({
		url: "https://api.igdb.com/v4/games",
		method: "POST",
		headers: {
			Accept: "application/json",
			"Client-ID": process.env.client_id,
			Authorization: `Bearer ${process.env.access_token}`,
		},
		data: `fields name, cover.url, summary, genres.name; where id = ${gameId};`,
	})
		.then((response) => {
			console.log(response.data[0].genres);
			const gamesArray = response.data.map((individualGame) => {
				if (individualGame.cover) {
					return {
						...individualGame,
						summary:
							individualGame.summary.length > 200
								? individualGame.summary.slice(0, 200) + "..."
								: individualGame.summary,
						cover: {
							...individualGame.cover,
							url: individualGame.cover.url.replace("t_thumb", "t_cover_big"),
						},
					};
				} else {
					return {
						...individualGame,
						summary:
							individualGame.summary.length > 200
								? individualGame.summary.slice(0, 200) + "..."
								: individualGame.summary,
						cover: {
							url: "https://upload.wikimedia.org/wikipedia/en/9/9a/Among_Us_cover_art.jpg",
						},
					};
				}
			});

			res.render(`game-details.hbs`, { game: gamesArray[0] });
		})
		.catch((err) => {
			console.error(err);
		});
});

router.post("/games/save", (req, res, next) => {
	console.log(req.body);
	const { name, summary, coverUrl, igdbId, genres } = req.body;
	//res.send("soon to be saved");
	Game.create({
		name,
		summary,
		coverUrl,
		igdbId,
		genres,
		userId: req.session.currentUser._id,
	})
		.then((savedGame) => {
			User.findByIdAndUpdate(
				req.session.currentUser._id,
				{ $push: { gamesArray: savedGame } },
				{ new: true }
			).then((response) => {
				res.redirect("/userProfile");
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

module.exports = router;
