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
        drawCards();
    }
}

function shuffleCards() { // Shuffles cards by swapping their values in the array
    for (let i = 0; i < 52; i++) {
        let j = Math.floor(Math.random() * 52);
        if (j === i) continue;
        deck.swap(i, j);
    }
}

function drawCards() { // Draws cards to the canvas element
    for (let i = 0; i < 52; i++) {
        let canvas = document.getElementById("cardCanvas");
        let context = canvas.getContext("2d");
        console.log(deck[i]);
        context.drawImage(deck[i].image, 0, 0, 691, 1056,(i % 13) * 70, Math.floor(i / 13) * 100, 64, 94);
    }
}

//-----------------------------
/* - Create player's hand and community cards, then finds the best possible hand that can be created using an algorithm
 - Then ranks the hand's strength*/
//-----------------------------

// Generates the player's hand by shifting the top cards of the deck in the array by 2 places
let holeCards = [];

function playerHand(){
    for(let i = 0; i < 2; i++) {
        holeCards[i] = deck.shift();
        let canvas = document.getElementById("actionCanvas");
        let context = canvas.getContext("2d");
        // Draws the cards
        context.drawImage(holeCards[i].image, 0, 0, 691, 1056,((document.getElementById("actionCanvas").clientWidth/2)-65)+(65*i), (document.getElementById("actionCanvas").clientHeight/2)-40, 80, 130);
    }
    return playerHand;
}

function displayHand(){ // Outputs the player's hand
    console.log(playerHand());
    console.log(deck);
}

