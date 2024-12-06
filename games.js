$(document).ready(function () {
    let games = [];

    function displayGames(filteredGames) {
        let gameList = $("#gameList");
        gameList.empty();

        filteredGames.forEach(game => {
            gameList.append(`
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${game.name}</h5>
                            <p class="card-text">${game.description}</p>
                            <p>Category: ${game.category}</p>
                            <p>Price: $${game.price}</p>
                            <p>Rating: ${game.rating}</p>
                            <a href="game.html?id=${game.id}" class="btn btn-primary add-to-cart">View Details</a>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    // Fetch games from the server
    $.get('/api/games', function (data) {
        games = data;
        displayGames(games);
    }).fail(function () {
        alert('Failed to load games.');
    });

    // Event listeners for category filter and sorting
    $("#categoryFilter").change(function () {
        let category = $(this).val();
        let filteredGames = games.filter(game => game.category === category || category === "");
        displayGames(filteredGames);
    });

    $("#sortFilter").change(function () {
        let sortBy = $(this).val();
        let sortedGames = [...games];
        if (sortBy === "price") {
            sortedGames.sort((a, b) => a.price - b.price);
        } else if (sortBy === "rating") {
            sortedGames.sort((a, b) => b.rating - a.rating);
        }
        displayGames(sortedGames);
    });
});
