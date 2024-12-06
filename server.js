const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const stripe = require("stripe")("sk_test_51QNtW3ErjrOlYQJN4VAF8UqAWAo0V7rDdOm151gv00O0iUW3RjIduxWcpqJ7TWau8OKpjyfvkH1lqxAPzWVhOwuh00SGbQE8G0");

const PORT = 3000;

const filePath = path.join(__dirname, "data", "games.json");

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (req.method === "GET") {

        if (pathname === "/api/games") {
            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Internal Server Error" }));
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(data);
                }
            });
        } 

        else if (pathname.startsWith("/api/games/")) {
            const id = parseInt(pathname.split("/").pop());
            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Internal Server Error" }));
                } else {
                    const games = JSON.parse(data);
                    const game = games.find((g) => g.id === id);
                    if (game) {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify(game));
                    } else {
                        res.writeHead(404, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Game not found" }));
                    }
                }
            });
        } else {
            const filePath = path.join(__dirname, pathname === "/" ? "index.html" : pathname);
            const extname = path.extname(filePath);
            let contentType = "text/html";

            switch (extname) {
                case ".js":
                    contentType = "text/javascript";
                    break;
                case ".css":
                    contentType = "text/css";
                    break;
                case ".json":
                    contentType = "application/json";
                    break;
                case ".png":
                    contentType = "image/png";
                    break;
                case ".jpg":
                    contentType = "image/jpeg";
                    break;
            }

            fs.readFile(filePath, (err, content) => {
                if (err) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("File Not Found");
                } else {
                    res.writeHead(200, { "Content-Type": contentType });
                    res.end(content, "utf-8");
                }
            });
        }
    } else if (req.method === "POST" && pathname === "/api/games") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const newGame = JSON.parse(body);

                fs.readFile(filePath, "utf8", (err, data) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Internal Server Error" }));
                        return;
                    }

                    const games = JSON.parse(data);
                    newGame.id = Date.now(); // Unique ID for the game
                    games.push(newGame);

                    fs.writeFile(filePath, JSON.stringify(games, null, 2), (writeErr) => {
                        if (writeErr) {
                            res.writeHead(500, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ error: "Internal Server Error" }));
                        } else {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ message: "Game added successfully" }));
                        }
                    });
                });
            } catch (err) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid request body" }));
            }
        });
    } else if (req.method === "PUT" && pathname.startsWith("/api/games/")) {
        const id = parseInt(pathname.split("/").pop());
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const updatedGame = JSON.parse(body);

                fs.readFile(filePath, "utf8", (err, data) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Internal Server Error" }));
                        return;
                    }

                    const games = JSON.parse(data);
                    const gameIndex = games.findIndex((game) => game.id === id);

                    if (gameIndex === -1) {
                        res.writeHead(404, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Game not found" }));
                        return;
                    }

                    games[gameIndex] = { ...games[gameIndex], ...updatedGame };

                    fs.writeFile(filePath, JSON.stringify(games, null, 2), (writeErr) => {
                        if (writeErr) {
                            res.writeHead(500, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ error: "Internal Server Error" }));
                        } else {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ message: "Game updated successfully" }));
                        }
                    });
                });
            } catch (err) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid request body" }));
            }
        });
    } else if (req.method === "DELETE" && pathname.startsWith("/api/games/")) {
        const id = parseInt(pathname.split("/").pop());

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal Server Error" }));
                return;
            }

            let games = JSON.parse(data);
            const gameIndex = games.findIndex((game) => game.id === id);

            if (gameIndex === -1) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Game not found" }));
                return;
            }

            games = games.filter((game) => game.id !== id);

            fs.writeFile(filePath, JSON.stringify(games, null, 2), (writeErr) => {
                if (writeErr) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Internal Server Error" }));
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Game deleted successfully" }));
                }
            });
        });
    } 
    
    else if (req.method === "POST" && pathname === "/api/payment") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", async () => {
            try {
                const { items } = JSON.parse(body);

                const totalAmount = items.reduce(
                    (sum, item) => sum + item.price_data.unit_amount * item.quantity,
                    0
                );

                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: items,
                    mode: "payment",
                    success_url: "http://localhost:3000/success.html",
                    cancel_url: "http://localhost:3000/cart.html",
                });

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ sessionId: session.id }));
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    }
    
    else 
    {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Endpoint Not Found");
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
