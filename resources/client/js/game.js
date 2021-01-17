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

// Draws all hands of all players immediately
let drawAll = true;

function drawAllHands(){
    if(drawAll === true){
        for(let i = 0; i <4;i++){
            playerArray[i].drawHand(i);
        }
        drawAll = false;
    }
}

// elementId - id of element to draw to
// cardRef - card array to be drawn from
// iStart - start value of i for iteration
// iEnd - value to terminate for iteration
//  fDx - x coordinate of image in canvas
//  fDx - y coordinate of image in canvas
// appendOnly - set to true if to take the top i cards from the deck

// Generates the player's hand by shifting the top cards of the deck in the array by 2 places
// function drawPlayerHand(){
//     if(gameTurn  === 2){
//         drawCards("playerCanvas1", 0,2, holeCards, 110, 162, true);
//     }
// }


//-----------------------------
// Canvas Functions
//-----------------------------

// Updates all canvases to display new arrangements/data
function updateCanvas(){
    clearCanvas("cardCanvas");
    displayCommCards();
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
    for(let i=1;i<5;i++) {
        clearCanvas("playerCanvas"+i);
    }
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
        drawCommCards(gameTurn-1,gameTurn, true);
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
        this.handDrawn = false;
        this.isWinner = false;
        this.isEliminated = false;
        this.handRank = 0;
    }

    // Reset currentTurn and actionDone
    actionReset(){
        this.currentTurn = false;
        this.actionDone = 0;
    }

    // User draws hand - x designates which board to draw to
    drawHand(x){
        if((gameTurn  === 2)&&(this.handDrawn === false)){
            holeCards = [];
            drawCards("playerCanvas"+(x+1), 0,2, holeCards, 110, 162, true);
            this.holeCards = holeCards;
            // Ensures that the player only draws their hand once
            this.handDrawn = true;
        }
    }

    // User betting function
    bet(z){
        if((z >= 1) && (z <= this.pocket) && (this.currentTurn === true) &&(this.actionDone !== 2)) {
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
        clearCanvas("playerCanvas" + (playerTurn+1))
        this.actionDone = 2;
    }


}

// Creates player instances that interact with the game
function playerInitHandler() {
    let playerNames = ["mainUser", "bot1", "bot2", "bot3"];
    let playerArray = [];
    for (let i = 0; i < 4; i++) {
        let x = new gamePlayer(i, playerNames[i], 1000);
        playerArray.push(x);
    }
    return playerArray;
}

let playerTurn = 0; // Global variable to identify whose turn it is
let playerArray = playerInitHandler(); // See below; used for global reference
let loserArray = [];

// Advances players' turn by 1
function nextPlayerTurn(){
    // If the player has folded, skip their turn
    if(playerArray[playerTurn].actionDone === 2){
        console.log(playerArray[playerTurn].igName + "'s turn skipped as they have folded");
        playerTurn++;
    }

    else {
        let x = playerArray[playerTurn];
        console.log(x.igName);
        debugger;

        playerActionDisplay(x);
        playerTurn++;
        if (playerTurn - 1 === playerArray.length - 1) {
            playerTurn = 0;
            console.log("new round");
            nextRound();
        }
    }
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

function displayPlayers(){
    console.log(playerArray);
}

//-----------------------------
// Betting / Folding functions
//-----------------------------

let pot = 0;

// Betting function containing argument for the player
function gameBetFunc(player){
    player.currentTurn = true;
    let x = document.getElementById("input1");
    let y = Number(x.value);
    player.bet(y);
    pot += player.betAmount;
    player.betAmount = 0;
    document.getElementById("pot").innerHTML =  pot;
    nextPlayerTurn();
}

// Actual betting function used in the page
function trueBetFunc(){
    gameBetFunc(playerArray[playerTurn]);
}

// Folding function containing argument for the player
function gameFoldFunc(player){
    player.currentTurn = true;
    player.fold();
    nextPlayerTurn();
}

// Actual folding function used in page
function trueFoldFunc(){
    gameFoldFunc(playerArray[playerTurn]);
}



//-----------------------------
// Game Event Handler
//-----------------------------

function beginGame(){
   drawAllHands();
    drawDeck();
}

// Handles the game rounds
// Iterate turn based on the round
// 2 - pre-flop
// 3 - flop
// 4 - turn
// 5 - river
// Each user has 1 playerTurn per gameTurn, i.e. 1 action only for pre-flop, flop, turn, river
let gameTurn = 2;

// Combines displayCommCards and displayHand into one function
// Advances the round by 1
function nextRound(){
    gameTurn++;

    // Clears all actions taken by players
    for(let i=0;i<4;i++){
        let x = playerArray[i];
        // If user folds, they can't partake in the round
        if(x.actionDone === 2){
            x.actionDone = 2;
        }
        else {
            x.actionReset();
        }
    }

     if (gameTurn === 6){
         for(let i=0;i<4;i++){
             let x = playerArray[i];
             x.holeCards = [];
             x.actionReset();
             x.handDrawn = false;
         }
         // Removes and displays new random deck
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









