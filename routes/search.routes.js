function fetchGames() {
	fetch("/routes/index.routes.js")
		.then((response) => response.json)
		.then((json) => takeData(json));
}

fetchGames();
