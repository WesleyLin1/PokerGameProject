// Function to allow swaps
Array.prototype.swap = function (x,y) {
    let b = this[x];
    this[x] = this[y];
    this[y] = b;
    return this;
};


//-----------------------------
// Deck Generation and Shuffle
//-----------------------------

let deck = []; // Declare empty array deck
let cardsLoaded = 0; // Sets the amount of cards loaded to 0
const suitNames = ["Spades", "Clubs", "Diamond", "Hearts"]; // Declare suit names as constants
const valueNames = ["Ace", "2","3","4","5","6","7","8","9","10","Jack", "Queen", "King"]; // Ditto with ranks

function displayRandomDeck() {
    for (let i = 0; i < 52; i++) {
        let image = new Image();
        image.src = "../client/img/" + i + ".png";
        image.onload = checkCards;
        deck.push({
            image: image,
            suit: suitNames[Math.floor(i / 13)],
            value: valueNames[i % 13]
        });
    }
}

function checkCards() {
    cardsLoaded++;
    if (cardsLoaded === 52) {
        shuffleCards();
        drawDeck();
    }
}

function shuffleCards() { // Shuffles cards by swapping their values in the array
    for (let i = 0; i < 52; i++) {
        let j = Math.floor(Math.random() * 52);
        if (j === i) continue;
        deck.swap(i, j);
    }
}

function drawDeck() { // Draws the deck to the canvas element
    drawCards("cardCanvas", 0,52, deck, 64, 90, false)
}

//-----------------------------
// Player Hand and Community Cards
//-----------------------------

// Player's hand - 2 cards
let holeCards = [];

// Community cards - 5 cards
let commCards = [];

// elementId - id of element to draw to
// cardRef - card array to be drawn from
// iStart - start value of i for iteration
// iEnd - value to terminate for iteration
//  fDx - x coordinate of image in canvas
//  fDx - y coordinate of image in canvas
// appendOnly - set to true if to take the top i cards from the deck

// General function for drawing cards
function drawCards(elementId, iStart, iEnd, cardRef, fDx, fDy, appendOnly){
    let canvas = document.getElementById(elementId);
    let context = canvas.getContext("2d");

    for (let i = iStart; i < iEnd; i++) {
        if (appendOnly === true) {
            cardRef.push(deck.shift());
        }
        console.log(cardRef[i]);
        context.drawImage(cardRef[i].image, (i % 13) * fDx, Math.floor(i / 13) * fDy, fDx, fDy);
    }
}

// Generates the player's hand by shifting the top cards of the deck in the array by 2 places
// Boolean ensures this is only executed once
let drawnOnce = true;
function drawPlayerHand(){
    if(drawnOnce === true){
        drawCards("actionCanvas", 0,2, holeCards, 110, 162, true);
        drawnOnce = false;
    }
}

// Outputs the player's hand
function displayHand(){
    drawPlayerHand();
    updateCanvas();
    console.log(holeCards);
    console.log(deck);
}


// Updates all canvases to display new arrangements/data
function updateCanvas(){
    drawDeck();
    drawPlayerHand();
}

//-----------------------------
// Create community cards
//-----------------------------
// Iterate turn based on the round
// 2 - pre-flop
// 3 - flop
// 4 - turn
// 5 - river
let turn = 2;

// start is the start value for i in drawCards()
// step iterates based on what turn it is; iEnd value
// appendReset is ditto above but with only adding 1 element at a time
function drawCommCards(start, step, appendReset){
    drawCards("commCardCanvas",start,step, commCards, 110, 162, appendReset);
}

function displayCommCards(){
    turn++;
    if(turn === 5){
        drawCommCards(turn-1, turn, true);
    }
    else if(turn === 4){
        drawCommCards(turn-1, turn, true);
    }
    else if(turn === 3){
        drawCommCards(0, turn, true);
    }
    updateCanvas();
}



