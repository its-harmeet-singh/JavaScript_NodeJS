$(document).ready(function () {
    const gameForm = $("#gameForm");
    const adminGameList = $("#adminGameList");

    function loadGames() {
        adminGameList.empty();
        $.getJSON("/api/games", function (games) {
            games.forEach((game) => {
                const gameCard = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${game.name}</h5>
                            <p class="card-text">Category: ${game.category}</p>
                            <p class="card-text">Price: $${game.price}</p>
                            <p class="card-text">Brand: ${game.brand}</p>
                            <p class="card-text">Rating: ${game.rating}</p>
                            <p class="card-text">Description: ${game.description}</p>
                            <button class="btn btn-warning btn-sm edit-game" data-id="${game.id}">Edit</button>
                            <button class="btn btn-danger btn-sm delete-game" data-id="${game.id}">Delete</button>
                        </div>
                    </div>`;
                adminGameList.append(gameCard);
            });
        });
    }

    loadGames();

    gameForm.on("submit", function (e) {
        e.preventDefault();
        const gameData = {
            id: $("#gameId").val(),
            name: $("#gameName").val(),
            category: $("#gameCategory").val(),
            price: parseFloat($("#gamePrice").val()),
            brand: $("#gameBrand").val(),
            rating: parseFloat($("#gameRating").val()),
            description: $("#gameDescription").val(),
        };

        const method = gameData.id ? "PUT" : "POST";
        const url = gameData.id ? `/api/games/${gameData.id}` : "/api/games";

        $.ajax({
            type: method,
            url: url,
            data: JSON.stringify(gameData),
            contentType: "application/json",
            success: function () {
                gameForm.trigger("reset");
                loadGames();
            },
        });
    });

    adminGameList.on("click", ".delete-game", function () {
        const id = $(this).data("id");

        $.ajax({
            type: "DELETE",
            url: `/api/games/${id}`,
            success: function () {
                loadGames();
            },
        });
    });

    adminGameList.on("click", ".edit-game", function () {
        const id = $(this).data("id");

        $.getJSON(`/api/games/${id}`, function (game) {
            $("#gameId").val(game.id);
            $("#gameName").val(game.name);
            $("#gameCategory").val(game.category);
            $("#gamePrice").val(game.price);
            $("#gameBrand").val(game.brand);
            $("#gameRating").val(game.rating);
            $("#gameDescription").val(game.description);
        });
    });
});
