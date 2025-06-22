/**
 * Chess Board and Game Replay Functionality
 * This script initializes and manages a chess board that demonstrates a predefined game.
 */

// Initialize the chessboard
const board = Chessboard2('myBoard', 'start');

// Define the moves of the chess game to be displayed
const moves = [
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

// Game state tracking
let currentIndex = 0;
const gamePosition = [];

/**
 * Sets the board to a specific position in the game
 * @param {number} index - The position index to display
 */
const setPosition = (index) => {
    if (index >= 0 && index < gamePosition.length) {
        board.position(gamePosition[index]);
        currentIndex = index;
    }
};

/**
 * Updates the board with a new move and stores the resulting position
 * @param {string|array} move - The move to apply (can be a single move or an array for castling)
 */
const updatePosition = (move) => {
    if (Array.isArray(move)) {
        move.forEach(m => board.move(m));
    } else {
        board.move(move);
    }
    gamePosition.push(board.fen());
};

// Set up event listeners for the control buttons
$(document).ready(function() {
    // Store the initial position
    gamePosition.push(board.fen());
    
    // Next move button
    $('#nextBtn').on('click', function() {
        if (currentIndex < moves.length) {
            const move = moves[currentIndex];
            if (move) {
                updatePosition(move);
            }
            currentIndex++;
        }
    });
    
    // Previous move button
    $('#prevBtn').on('click', function() {
        setPosition(currentIndex - 2); // Step back twice
    });
    
    // Reset button
    $('#startPositionBtn').on('click', function() {
        board.start();
        gamePosition.length = 0; // Clear the array
        gamePosition.push(board.fen()); // Add the starting position
        currentIndex = 0;
    });
});