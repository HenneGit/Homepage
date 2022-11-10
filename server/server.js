const express = require("express");
const app = express();
path = require('path');
const stockfish = require("stockfish");
const engine = stockfish();
const fenregex = "/^([rnbqkpRNBQKP1-8]+\/){7}([rnbqkpRNBQKP1-8]+)\s[bw]\s(-|K?Q?k?q?)\s(-|[a-h][36])\s(0|[1-9][0-9]*)\s([1-9][0-9]*)/";

// engine.onmessage = function(msg) {
//     console.log(msg);
// };
//
// engine.postMessage("uci");

app.get("/api", (req, res) => {
    res.json({
        "users":
            ["userOne", "userTwo"]
    })
});

app.listen(5000, () => {
    console.log("Server started on 5000");
})


// app.post('/stockfish', (request, response) => {
//
//     if (!request.body.fen.match(fenregex)) {
//         response.send("Invalid fen string");
//         return;
//     }
//
// // if chess engine replies
//     engine.onmessage = function(msg) {
//         console.log(msg);
//         // in case the response has already been sent?
//         if (response.headersSent) {
//             return;
//         }
//         // only send response when it is a recommendation
//         if (typeof(msg == "string") && msg.match("bestmove")) {
//             response.send(msg);
//         }
//     }
//
// // run chess engine
//     engine.postMessage("ucinewgame");
//     engine.postMessage("position fen " + request.body.fen);
//     engine.postMessage("go depth 18");
// });

app.get("/letters", (req, res) => {
    res.json({
        "A": ["r2c0", "r2c1", "r2c2", "r2c3", "r3c4", "r4c1", "r4c2", "r4c3", "r4c4", "r5c4", "r4c4", "r6c1", "r6c2", "r6c3",
            "r6c0", "r5c0", "r4c0"],
        "B": ["r0c0", "r1c0", "r2c0", "r3c0", "r4c0", "r5c0", "r6c0", "r2c1", "r2c2", "r2c3", "r3c4", "r6c1", "r6c2",
            "r6c3", "r4c4", "r5c4"],
        "C": ["r3c0", "r4c0", "r5c0", "r2c1", "r2c2", "r2c3", "r6c1", "r6c2", "r6c3"],
        "D": ["r0c4", "r1c4", "r2c4", "r3c4", "r4c4", "r5c4", "r2c1", "r2c2", "r2c3", "r4c0", "r5c0", "r6c1", "r6c2", "r6c3",
            "r3c0"],
        "E": ["r2c1", "r2c2", "r2c3", "r3c0", "r3c4", "r4c0", "r4c1", "r4c2",
            "r4c3", "r4c4", "r5c0", "r6c1", "r6c2", "r6c3"],
        "F": ["r3c0", "r3c1", "r3c2", "r0c1", "r1c1", "r2c1", "r3c1", "r4c1", "r5c1", "r6c1", "r0c2"],
        "H": ["r0c0", "r1c0", "r2c0", "r3c0", "r4c0", "r5c0", "r6c0", "r3c1", "r3c2", "r3c3", "r4c3", "r5c3", "r6c3"],
        "I": ["r3c3", "r4c3", "r5c3", "r6c3", "r2c3"],
        "L": ["r0c0", "r1c0", "r2c0", "r3c0", "r4c0", "r5c0", "r6c1", "r6c2", "r6c3"],
        "M": ["r3c0", "r4c0", "r5c0", "r6c0", "r2c0", "r2c1", "r2c2", "r2c3", "r2c4", "r3c2", "r3c4",
            "r4c2", "r5c2", "r6c2", "r4c4", "r5c4", "r6c4"],
        "N": ["r3c0", "r4c0", "r5c0", "r6c0", "r2c1", "r2c2", "r2c3", "r3c3", "r4c3", "r5c3", "r6c3", "r2c0", "r4c3"],
        "O": ["r2c1", "r2c2", "r2c3", "r3c0", "r3c4", "r4c0", "r4c4", "r5c0",
            "r5c4", "r6c1", "r6c2", "r6c3"],
        "R": ["r2c0", "r3c0", "r4c0", "r5c0", "r6c0", "r2c0", "r2c1", "r2c2"],
        "S": ["r2c1", "r2c2", "r2c3", "r3c0", "r4c0", "r4c1", "r4c2", "r5c3", "r6c0", "r6c1", "r6c2"],
        "T": ["r0c1", "r1c1", "r2c1", "r3c1", "r4c1", "r5c1", "r6c1", "r6c2", "r2c2", "r2c0"],
        "U": ["r2c0", "r3c0", "r4c0", "r5c0", "r6c0", "r6c1", "r6c2", "r6c3", "r3c3", "r4c3", "r5c3", "r6c3", "r2c3"],
        "V": ["r2c0", "r3c0", "r4c0", "r5c1", "r6c2", "r5c3", "r4c4", "r3c4", "r2c4"],
        "DASH": ["r6c0", "r6c1", "r6c2", "r6c3", "r6c4"]
    });
});

app.get("/bishopblack", (req, res) => {
    let p = path.join(__dirname, 'assets/chess/bishopblack.svg');
    res.sendFile(p);

});

app.get("/kingblack", (req, res) => {
    let p = path.join(__dirname, 'assets/chess/kingblack.svg');
    res.sendFile(p);

});

app.get("/queenblack", (req, res) => {
    let p = path.join(__dirname, 'assets/chess/queenblack.svg');
    res.sendFile(p);

});


app.get("/knightblack", (req, res) => {
    let p = path.join(__dirname, 'assets/chess/knightblack.svg');
    res.sendFile(p);

});

app.get("/pawnblack", (req, res) => {
    let p = path.join(__dirname, 'assets/chess/pawnblack.svg');
    res.sendFile(p);

});

app.get("/rookblack", (req, res) => {
    // absolute path to the file
    let p = path.join(__dirname, 'assets/chess/rookblack.svg');
    res.sendFile(p);

});


app.get("/bishopwhite", (req, res) => {
    let p = path.join(__dirname, 'assets/chess/bishopwhite.svg');
    res.sendFile(p);

});

app.get("/kingwhite", (req, res) => {
    let p = path.join(__dirname, 'assets/chess/kingwhite.svg');
    res.sendFile(p);

});

app.get("/queenwhite", (req, res) => {
    let p = path.join(__dirname, 'assets/chess/queenwhite.svg');
    res.sendFile(p);

});


app.get("/knightwhite", (req, res) => {
    let p = path.join(__dirname, 'assets/chess/knightwhite.svg');
    res.sendFile(p);

});

app.get("/pawnwhite", (req, res) => {
    let p = path.join(__dirname, 'assets/chess/pawnwhite.svg');
    res.sendFile(p);

});

app.get("/rookwhite", (req, res) => {
    // absolute path to the file
    let p = path.join(__dirname, 'assets/chess/rookwhite.svg');
    res.sendFile(p);

});

