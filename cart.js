$(document).ready(function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const stripePublicKey = "pk_test_51QNtW3ErjrOlYQJNdPAX8qn2ydDNkSpgbkx9TDCsIcEFHUPWTagz5aC3ujq8W1mGTNKgqZ5gyW9s7rXRPx8R89IT00J2ShAfzw";

    // Function to display cart items
    function displayCart() {
        let cartItems = $("#cart-items");
        cartItems.empty();

        if (cart.length === 0) {
            cartItems.html("<p class='text-white'>Your cart is empty.</p>");
            $("#checkoutBtn").hide();
        } else {
            cart.forEach(item => {
                cartItems.append(`
                    <div class="cart-item">
                        <img src="assets/images/games/${item.id}.jpg" alt="${item.name}">
                        <div class="cart-item-details">
                            <div>
                                <strong>${item.name}</strong><br>
                                $${item.price} x ${item.quantity} = <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                            </div>
                        </div>
                        <div class="cart-item-buttons">
                            <button class="btn btn-sm btn-secondary update-quantity" data-id="${item.id}" data-action="decrease">-</button>
                            <button class="btn btn-sm btn-secondary update-quantity" data-id="${item.id}" data-action="increase">+</button>
                            <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}">Remove</button>
                        </div>
                    </div>
                `);
            });
            $("#checkoutBtn").show();
        }
    }

    // Update quantity
    $(document).on("click", ".update-quantity", function () {
        const gameId = $(this).data("id");
        const action = $(this).data("action");
        const item = cart.find(game => game.id === gameId);

        if (item) {
            if (action === "increase") {
                item.quantity += 1;
            } else if (action === "decrease" && item.quantity > 1) {
                item.quantity -= 1;
            }
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    });

    // Remove item
    $(document).on("click", ".remove-item", function () {
        const gameId = $(this).data("id");
        cart = cart.filter(game => game.id !== gameId);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    });

    $("#checkoutBtn").click(function () {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const lineItems = cart.map(item => ({
            price_data: {
                currency: "usd",
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        $.ajax({
            url: "/api/payment",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ items: lineItems }),
            success: function (response) {
                const stripe = Stripe(stripePublicKey);
                stripe.redirectToCheckout({ sessionId: response.sessionId });
            },
            error: function () {
                alert("Error processing your payment. Please try again.");
            },
        });
    });

    // Initial display
    displayCart();
});
