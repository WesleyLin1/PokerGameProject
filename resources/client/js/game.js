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
const rankNames = ["Ace", "2","3","4","5","6","7","8","9","10","Jack", "Queen", "King"]; // Ditto with ranks

function displayRandomDeck() {
    for (let i = 0; i < 52; i++) {
        let image = new Image();
        image.src = "../client/img/" + i + ".png";
        image.onload = checkCards;
        deck.push({
            image: image,
            suit: suitNames[Math.floor(i / 13)],
            rank: rankNames[i % 13]
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
    drawCards("cardCanvas", 0,deck.length, deck, 64, 90, false)
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
        //console.log(cardRef[i]);
        context.drawImage(cardRef[i].image, (i % 13) * fDx, Math.floor(i / 13) * fDy, fDx, fDy);
    }
}

// Generates the player's hand by shifting the top cards of the deck in the array by 2 places

function drawPlayerHand(){
    if(turn  === 2){
        drawCards("actionCanvas", 0,2, holeCards, 110, 162, true);
    }
}

// Outputs the player's hand
function displayHand(){
    drawPlayerHand();
    updateCanvas();
}

// Updates all canvases to display new arrangements/data
function updateCanvas(){
    clearCanvas("cardCanvas");
    drawDeck();
    drawPlayerHand();
    // console.log(holeCards);
    // console.log(deck);
    // console.log(commCards);
}

// Clears canvas to allow redrawing of images
function clearCanvas(canvasId){
    let canvas = document.getElementById(canvasId);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

//-----------------------------
// Create community cards
//-----------------------------
// Iterate turn based on the round
// 2 - pre-flop
// 3 - flop
// 4 - turn
// 5 - river
let turn = 1;

// start is the start value for i in drawCards()
// step iterates based on what turn it is; iEnd value
// appendReset is ditto above but with only adding 1 element at a time
function drawCommCards(start, step, appendReset){
    drawCards("commCardCanvas",start,step, commCards, 110, 162, appendReset);
}

function displayCommCards(){
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

// Combines displayCommCards and displayHand into one function
function nextRound(){
    displayHand();
    displayCommCards();
}

//-----------------------------
// Initialise player / bots
//-----------------------------

// Refers to a player of the game, which can be the user themselves or a bot
class gamePlayer{
    // refName is for use in functions, igName is used for displaying on-screen names
    constructor(refName, igName, pocket) {
        this.refName = refName;
        this.igName = igName;
        this.pocket = pocket;
        this.betAmount = 0;
        this.currentTurn = false;
    }

    // Composite functions (using getter/setter methods)
    bet(z){
        if((z >= 1) && (z <= this.pocket)) {
            this.betAmount = z;
            this.pocket = this.pocket - z;
            console.log(this.pocket, this.betAmount);
        }
        else {
            console.log("You can't bet this much!");
        }
    }
}

//-----------------------------
// Betting / Folding functions
//-----------------------------
let main = new gamePlayer(0, "tester", 1000,0);
function gameBet(){
    let x = document.getElementById("input1");
    let y = 0;
    y = Number(x.value);
    main.bet(y);
    nextRound();
}



//-----------------------------
// Game Event Handler
//-----------------------------

function gameHandler(){
    let  playerNames = ["mainUser","bot1","bot2", "bot3" ];
    let playerArray = [];
    for(let i = 0; i < 4; i++){
        let x = new gamePlayer(i, playerNames[i], 1000);
        console.log(x);
    }
}






