document.addEventListener("DOMContentLoaded", () => {
    const board = Chessboard("chess-board", {
        draggable: true,
        position: "start",
        onDrop: handleMove,
    });

    const game = new Chess();

    function handleMove(source, target) {
        const move = game.move({ from: source, to: target, promotion: "q" });
        if (move === null) return "snapback";

        board.position(game.fen());

        if (document.body.dataset.mode === "ai") {
            setTimeout(() => aiMove(), 500);
        }
    }

    function aiMove() {
        stockfish.postMessage(`position fen ${game.fen()}`);
        stockfish.postMessage("go depth 15");
        stockfish.onmessage = (event) => {
            if (event.data.includes("bestmove")) {
                game.move(event.data.split(" ")[1]);
                board.position(game.fen());
            }
        };
    }
});