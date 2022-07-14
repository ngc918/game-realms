const { Schema, model } = require("mongoose");

const gameSchema = new Schema({
	_id: {
		type: Number,
	},
	igdbId: [
		{
			type: Number,
		},
	],
	coverId: {
		type: Number,
	},
	coverUrl: {
		type: String,
	},
	summary: {
		type: String,
	},
	userId: {
		type: Number,
	},
});

const Game = model("Game", gameSchema);

module.exports = Game;
