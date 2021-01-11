"use strict";

// Remove element from page
function removeElement(){
    let y = document.getElementById("begin");
    y.remove();
}

// Generic function for replacing text in a HTML element
function elementReplaceText(elementId,text){
    document.getElementById(elementId).innerHTML = text;
}
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
        deck.push({
            image: image,
            suit: suitNames[Math.floor(i / 13)],
            rank: rankNames[i % 13]
        });
    }
    shuffleCards();
    drawDeck();
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
// Drawing Cards
//-----------------------------

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

// Discards all cards in all existing card arrays
function discardAll(){
    deck = [];
    commCards = [];
    holeCards = [];
}

//-----------------------------
// Player Hand and Community Cards
//-----------------------------

// Player's hand - 2 cards
// Community cards - 5 cards
let holeCards = [];
let commCards = [];

// elementId - id of element to draw to
// cardRef - card array to be drawn from
// iStart - start value of i for iteration
// iEnd - value to terminate for iteration
//  fDx - x coordinate of image in canvas
//  fDx - y coordinate of image in canvas
// appendOnly - set to true if to take the top i cards from the deck

// Generates the player's hand by shifting the top cards of the deck in the array by 2 places
function drawPlayerHand(){
    if(gameTurn  === 2){
        drawCards("actionCanvas", 0,2, holeCards, 110, 162, true);
    }
}


//-----------------------------
// Canvas Functions
//-----------------------------

// Updates all canvases to display new arrangements/data
function updateCanvas(){
    clearCanvas("cardCanvas");
    displayCommCards();
    drawPlayerHand();
    drawDeck();
}

// Clears canvas to allow redrawing of images
function clearCanvas(canvasId){
    let canvas = document.getElementById(canvasId);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// Clears all canvases
function fullClearCanvas(){
    clearCanvas("cardCanvas");
    clearCanvas("commCardCanvas");
    clearCanvas("actionCanvas");
}

//-----------------------------
// Create community cards
//-----------------------------

// start is the start value for i in drawCards()
// step iterates based on what turn it is; iEnd value
// appendReset is ditto above but with only adding 1 element at a time
function drawCommCards(start, step, appendReset){
    drawCards("commCardCanvas",start,step, commCards, 110, 162, appendReset);
}

function displayCommCards(){
    if(gameTurn === 5){
        drawCommCards(gameTurn-1, gameTurn, true);
    }
    else if(gameTurn === 4){
        drawCommCards(gameTurn-1, gameTurn, true);
    }
    else if(gameTurn === 3){
        drawCommCards(0, gameTurn, true);
    }
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
        this.currentTurn = true;
        // 0 - no action, 1 - bet/call/raise/all-in, 2 - fold
        this.actionDone = 0;
        this.holeCards = [];
        this.isWinner = false;
        this.handRank = 0;
    }

    // User draws hand
    drawHand(){
        if(gameTurn  === 2){
            drawCards("actionCanvas", 0,2, holeCards, 110, 162, true);
        }
    }

    // User betting function
    bet(z){
        if((z >= 1) && (z <= this.pocket) && (this.currentTurn === true)) {
            this.betAmount = z;
            this.pocket = this.pocket - z;
            console.log(this.pocket, this.betAmount);
            this.actionDone = 1;
        }
        else {
            console.log("Unable to bet");
        }
    }

    // User folds cards
    fold(){
        this.holeCards = [];
        this.actionDone = 2;
    }

    // Reset currentTurn and actionDone
    actionReset(){
        this.currentTurn = false;
        this.actionDone = 0;
    }
}

let playerTurn = 3; // Global variable to identify whose turn it is
let playerArray = playerInitHandler(); // See below; used for global reference

// Advances players' turn by 1
function nextPlayerTurn(){
    let x = playerArray[playerTurn];
    console.log(x.igName);
    playerActionDisplay(x);
    playerTurn++;
    if(playerTurn-1  === playerArray.length-1){
        playerTurn = 0;
        console.log("new round");
        nextRound();
    }
}



// Creates player instances that interact with the game
// This process should only be run once upon the game start
function playerInitHandler() {
    let playerNames = ["mainUser", "bot1", "bot2", "bot3"];
    let playerArray = [];
    for (let i = 0; i < 4; i++) {
        let x = new gamePlayer(i, playerNames[i], 1000);
        playerArray.push(x);
    }
    return playerArray;
}

// Displays  what action the player has taken
function playerActionDisplay(player){
    switch (player.actionDone) {
        case 0:
            console.log("No action");
            break;
        case 1:
            console.log("Bet");
            break;
        case 2:
            console.log("Fold");
            break;
    }
}

//-----------------------------
// Betting / Folding functions
//-----------------------------

let pot = 0;

function gameBetFunc(player){
    player.currentTurn = true;
    let x = document.getElementById("input1");
    let y = Number(x.value);
    player.bet(y);
    pot += player.betAmount;
    player.betAmount = 0;
    document.getElementById("pot").innerHTML =  pot;
    nextPlayerTurn();
    player.actionReset();
}

function trueBetFunc(){
    gameBetFunc(playerArray[playerTurn]);
}



//-----------------------------
// Game Event Handler
//-----------------------------

// Handles the game rounds and player turns

// Iterate turn based on the round
// 2 - pre-flop
// 3 - flop
// 4 - turn
// 5 - river
// Each user has 1 playerTurn per gameTurn, i.e. 1 action only for pre-flop, flop, turn, river
let gameTurn = 1;

// Combines displayCommCards and displayHand into one function
// Advances the round by 1
function nextRound(){
    gameTurn++;
     if (gameTurn === 6){
         fullClearCanvas();
        gameTurn = 2;
        discardAll();
        displayRandomDeck();
    }
    declareRoundNames();
    updateCanvas();
}

// Declares the round names
function declareRoundNames(){
    if (gameTurn === 2){
        elementReplaceText("round","Pre-flop");
    }
    else if(gameTurn === 3){
        elementReplaceText("round","Flop");
    }
    else if(gameTurn === 4){
        elementReplaceText("round","Turn");
    }
    else if(gameTurn === 5){
        elementReplaceText("round","River");
    }
}









