var board = Chessboard2('myBoard', 'start');

var moves = [
    'd2-d4', 'd7-d5',
    'g1-f3', 'g8-f6',
    'e2-e3', 'e7-e6',
    'f1-d3', 'c7-c5',
    'b2-b3', 'b8-c6',
    'c1-b2', 'f8-d6',
    ['e1-g1', 'h1-f1'], 'd8-c7', // Castling
    'a2-a3', 'b7-b6',
    'c2-c4', 'c8-b7',
    'b1-c3', 'a7-a6',
    'f1-e1', 'c5-d4',
    'e3-d4', ['e8-g8', 'h8-f8'], // Castling
    'c3-a4', 'd6-f4',
    'f3-e5', 'd5-c4',
    'b3-c4', 'c6-e5',
    'd4-e5', 'c7-c6',
    'd3-f1', 'f8-d8',
    'd1-b3', 'f6-g4',
    'h2-h3', 'd8-d3',
    'b3-b6', 'd3-h3',
    'b2-d4', 'f4-h2',
    'g1-h1', 'h2-e5'
];

var currentIndex = 0;
var gamePosition = [];

const setPosition = (index) => {
    if (index >= 0 && index < gamePosition.length) {
        board.position(gamePosition[index]);
        currentIndex = index;
    }
}

const updatePosition = (move) => {
    if (Array.isArray(move)) {
        move.forEach(m => board.move(m));
    } else {
        board.move(move);
    }
    gamePosition.push(board.fen());
}

$('#nextBtn').on('click', function () {
    if (currentIndex < moves.length) {
        const move = moves[currentIndex];
        if (move) {
            updatePosition(move);
        }
        currentIndex++;
    }
});

$('#prevBtn').on('click', function () {
    setPosition(currentIndex - 2); // step back twice
});

$('#startPositionBtn').on('click', function () {
    board.start();
    gamePosition = [];
    currentIndex = 0;
});

$(document).ready(function() {
    gamePosition.push(board.fen()); // store the start position
});
