$(document).ready(function() {
    loadGames();

    function loadGames() {
        $.getJSON("data/games.json", function(games) {
            displayGames(games);
        });
    }

    function displayGames(games) {
        let gameList = $("#game-list");
        gameList.empty();

        games.forEach(game => {
            let gameCard = `
                <div class="col-md-4">
                    <div class="card mb-4 shadow-sm">
                        <img src="${game.image}" class="card-img-top" alt="${game.name}">
                        <div class="card-body">
                            <h5 class="card-title">${game.name}</h5>
                            <p class="card-text">${game.description}</p>
                            <p><strong>Price:</strong> $${game.price}</p>
                            <button class="btn btn-primary add-to-cart" data-id="${game.id}">Add to Cart</button>
                        </div>
                    </div>
                </div>`;
            gameList.append(gameCard);
        });
    }

    // Filter and Sort Functionality
    $("#filter-category, #sort-price").on("change", function() {
        $.getJSON("data/games.json", function(games) {
            let category = $("#filter-category").val();
            let sortOrder = $("#sort-price").val();

            if (category) {
                games = games.filter(game => game.category === category);
            }
            if (sortOrder === "asc") {
                games.sort((a, b) => a.price - b.price);
            } else {
                games.sort((a, b) => b.price - a.price);
            }

            displayGames(games);
        });
    });
});
