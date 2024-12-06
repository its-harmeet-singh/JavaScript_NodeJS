$(document).ready(function () {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');

    if (!gameId) {
        $('#gameDetails').html('<h3 class="text-center text-white">Error: Game ID not provided.</h3>');
        return;
    }

    // Fetch game details from the server
    $.get('/api/games', function (games) {
        const game = games.find(g => g.id === parseInt(gameId));

        if (!game) {
            $('#gameDetails').html('<h3 class="text-center text-white">Error: Game not found.</h3>');
            return;
        }

        const stars = Array.from({ length: 5 }, (_, i) =>
            i < Math.round(game.rating)
                ? '<span class="star">&#9733;</span>'
                : '<span class="star">&#9734;</span>'
        ).join('');

        $('#gameDetails').html(`
            <div class="image-section col-md-4">
                <img src="assets/images/games/${game.id}.jpg" alt="${game.name}">
            </div>
            <div class="game-info col-md-8">
                <h2>${game.name}</h2>
                <p>${game.description}</p>
                <p><strong>Category:</strong> ${game.category}</p>
                <p><strong>Brand:</strong> ${game.brand}</p>
                <p><strong>Rating:</strong> ${stars}</p>
                <p class="price"><strong>Price:</strong> $${game.price.toFixed(2)}</p>
                <button id="addToCartBtn" class="btn btn-primary btn-lg">Add to Cart</button>
            </div>
        `);

        // Add to cart functionality
        $('#addToCartBtn').click(function () {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            // Check if the item is already in the cart
            const existingItem = cart.find(item => item.id === game.id);
            if (existingItem) {
                existingItem.quantity += 1; // Increment quantity if it exists
                showPopup(`${game.name} quantity updated in the cart!`);
            } else {
                // Add the game to the cart with quantity 1
                cart.push({ ...game, quantity: 1 });
                showPopup(`${game.name} has been added to the cart!`);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
        });
    }).fail(function () {
        $('#gameDetails').html('<h3 class="text-center text-white">Error: Failed to load game details.</h3>');
    });

    // Function to display popup
    function showPopup(message) {
        const popup = $('#customPopup');
        $('#popupMessage').text(message);
        popup.fadeIn();

        setTimeout(() => {
            popup.fadeOut();
        }, 3000);
    }
});
