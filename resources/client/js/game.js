"use strict";

//-----------------------------
// General functions
//-----------------------------

// Async/await function since JS is asynchronous
function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}

// Creates a new element and appends it to the page
// x is the element to create, y is the text to add
function createNewElement(x, y){
    let a = document.createElement(x);
    let b = document.createTextNode(y);
    a.appendChild(b);
    document.body.appendChild(a);
}

// Remove element from page
function removeElement(x){
    let y = document.getElementById(x);
    y.remove();
}

// Remove everything
function removeEverything(){
    removeElement("turnDiv");
    removeElement("round");
    removeElement("pot");
    removeElement("wrapper");
    removeElement("cardCanvas");
    removeElement("commCardCanvas");
    removeElement("actionDiv");
    removeElement("winner");
    removeElement("eliminated");
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

// Array containing image objects with the image of the back of the card
let cardBackArray = [];

// General function for drawing cards
function drawCards(elementId, iStart, iEnd, cardRef, fDx, fDy, appendOnly){
    let canvas = document.getElementById(elementId);
    let context = canvas.getContext("2d");

    for (let i = iStart; i < iEnd; i++) {
        if (appendOnly === true) {
            cardRef.push(deck.shift());
        }
        context.drawImage(cardRef[i].image, (i % 13) * fDx, Math.floor(i / 13) * fDy, fDx, fDy);
    }
}

// Discards all cards in all existing card arrays
function discardAll(){
    deck = [];
    commCards = [];
    holeCards = [];
}

// Generates the card back image
function genCardBack(){
    for(let i = 0; i < 52; i++) {
        let image = new Image();
        image.src = "../client/img/gray.png";
        cardBackArray.push(image);
    }
}

// Draws the back of cards
function drawCardBack(elementId){
    let canvas = document.getElementById(elementId);
    let context = canvas.getContext("2d");
    for(let j = 0;j < 2; j++){
        context.drawImage(cardBackArray[j], (j % 13) * 110, Math.floor(j / 13) * 162, 110, 162);
    }
}



//-----------------------------
// Player Hand and Community Cards
//-----------------------------

// Player's hand - 2 cards
// Community cards - 5 cards
let holeCards = [];
let commCards = [];

// Draws hands for the players, hiding the cards which aren't the main player's
let drawAll = true;

function drawHands(){
    if(drawAll === true){
        for(let i = 0; i < playerArray.length;i++){
            let x = playerArray[i];
            x.drawHand(i);
            if(x.showCards === false){
                clearCanvas("playerCanvas"+(i+1));
                x.hideCards(i);
            }
        }
        drawAll = false;
    }
}

// Draws all players' hands (at the end of the round)
function displayAllHands(){
    for(let i = 0; i < playerArray.length;i++) {
        let x = playerArray[i];
        if(x.holeCards.length === 2){
            clearCanvas("playerCanvas" + (i + 1));
            drawCards("playerCanvas" + (i + 1), 0, 2, x.holeCards, 110, 162, false);
        }
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
        document.getElementById("playerActionDiv"+i).innerText = "";
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

//-----------------------------
// Player
//-----------------------------

// Refers to a player of the game, which can be the user themselves or a bot
class gamePlayer{
    // igName is used for displaying on-screen names
    constructor(igName, pocket) {
        this.igName = igName;
        this.pocket = pocket;
        this.betAmount = 0;
        this.currentTurn = true;
        // 0 - no action, 1 - bet/call/raise/all-in, 2 - fold, 3 - check
        this.actionDone = 0;
        this.holeCards = [];
        this.handDrawn = false;
        this.isEliminated = false;
        this.handRank = 0;
        this.showCards = true;
        this.isRoundWinner = false;
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

    // Hides player cards
    hideCards(i){
        if(this.showCards === false){
            drawCardBack("playerCanvas"+(i+1));
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
        else if((z >= 1) && (z > this.pocket) &&(this.pocket !== 0)&& (this.currentTurn === true) &&(this.actionDone !== 2)) {
            this.betAmount = this.pocket;
            this.pocket = this.pocket - this.betAmount;
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
        clearCanvas("playerCanvas" + (playerTurn+1));
        this.actionDone = 2;
    }
    // User checks (ends their turn without betting)
    check(){
        this.actionDone = 3;
    }
}

//-----------------------------
// Bots
//-----------------------------

// Generates a random number between 1 and 100
// bias influences final value
function rng(multiplier,bias){
    return Math.round(Math.random() * multiplier) - bias;
}

class botAI extends  gamePlayer{
    constructor(igName, pocket) {
        super(igName, pocket);
        this.confidence = 45;
        this.tilt = 0;
    }
    assessHand(){
        if(gameTurn >= 3){
            return determineHands(playerTurn);
        }
    }
    // Call this after every round after the flop
    affectConfidence(){
        if(this.assessHand() > 8){
            this.confidence = this.confidence - rng(10, 0);
        }
        else{
            this.confidence = this.confidence + rng(5,0);
        }
    }
    // Call this after every River, once each round finishes
    affectTilt(){
        if(playerTurn === 6) {
            if (this.isRoundWinner !== true) {
                this.tilt = this.tilt + rng(50, -20);
            }
        }
    }
    affectAction(){
        this.affectConfidence();
        this.affectTilt();
    }
    considerAction(){
        this.confidence = 45;
        this.affectAction();
        if((this.confidence >=40)||(this.tilt >= 50)){
            gameBetFunc(playerArray[playerTurn], true);
        }
        else if(this.confidence < 40){
            gameFoldFunc(playerArray[playerTurn]);
        }
    }
}

// Creates player instances that interact with the game
function playerInitHandler() {
    let playerNames = ["mainUser", "bot1", "bot2", "bot3"];
    let playerArray = [];

    // Declare main player separately as they will be unique
    let a = new gamePlayer(playerNames[0], 1000);
    playerArray.push(a);

    for (let i = 1; i < 4; i++) {
        let x = new botAI(playerNames[i], 1000);
        playerArray.push(x);
        playerArray[i].showCards = false;
    }
    return playerArray;
}

let playerTurn = 0; // Global variable to identify whose turn it is
let playerArray = playerInitHandler(); // See below; used for global reference
let loserArray = [];

// Advances players' turn by 1
function nextPlayerTurn(){
    playerTurn++;
    if((playerTurn !== 0)&&(playerTurn !== playerArray.length)){
        debugger;
        async function f()
        {
            displayCurrentPlayerTurn();
            await sleep(rng(1000,-2000));
            playerArray[playerTurn].considerAction();
        }
        f();
    }
    else {
        // If the player has folded, skip their turn
        if (checkAllFolded() === true) {
            gameTurn = 5;
            playerTurn = 0;
            nextRound();
        } else {
            if (playerTurn === playerArray.length) {
                playerTurn = 0;
                console.log("new round");
                nextRound();
            } else if (playerArray[playerTurn].actionDone === 2) {
                console.log(playerArray[playerTurn].igName + "'s turn skipped as they have folded");
            } else {
                let x = playerArray[playerTurn];
                console.log(x.igName);
                displayCurrentPlayerTurn();
                if (playerTurn === 1) {
                    elementReplaceText("winner", "");
                    elementReplaceText("eliminated", "");
                }
            }
        }
    }
}

// Displays  what action the player has taken
function playerActionDisplay(player){
    let x = document.getElementById("playerActionDiv"+(playerTurn+1));
    switch (player.actionDone) {
        case 0:
            x.innerText = player.igName + " takes no action.";
            console.log("No action");
            break;
        case 1:
            console.log("Bet");
            x.innerText = player.igName + " bets " + player.betAmount + ".";
            break;
        case 2:
            console.log("Fold");
            x.innerText = player.igName + " folds.";
            break;
        case 3:
            console.log("Check");
            x.innerText = player.igName + " checks.";
            break;

    }
}

// x is the player object attribute to reference, i is an iterator argument (if iteration is used)
function displayPlayerAttribute(x,i, txt){
    let z = document.getElementById("playerActionDiv"+(i+1));
    let u = document.createElement("br");
    let v = document.createTextNode(x);
    let t = document.createTextNode(txt);
    z.appendChild(u);
    z.appendChild(t);
    z.appendChild(v);
}

function displayAllPockets(){
    for(let i = 0; i < playerArray.length; i++){
        displayPlayerAttribute(playerArray[i].pocket, i, "Chips: ");
    }
}

function displayAllNames(all){
    if(all === true) {
        for (let i = 0; i < playerArray.length; i++) {
            displayPlayerAttribute(playerArray[i].igName, i, "Name: ");
        }
    }
    else{
        displayPlayerAttribute(playerArray[playerTurn].igName, playerTurn, "Name: ");
    }
}

// Resets all players' actions
function resetAllPlayerActions(){
    for(let i=0;i<playerArray.length;i++){
        let x = playerArray[i];
        // If user folds, they can't partake in the round
        if(x.actionDone === 2){
            x.actionDone = 2;
        }
        else {
            x.actionReset();
        }
    }
}

// Shows the current player's turn on the top
function displayCurrentPlayerTurn(){
    let x = document.getElementById("turn");
    x.innerHTML = playerArray[playerTurn].igName;
}

// Checks if multiple players have folded
function checkAllFolded(){
    let x =playerArray;
    let counter = 0;
    let allFolded = false;
    for(let i = 0; i<playerArray.length; i++){
        if(x[i].actionDone === 2){
            counter++;
        }
    }
    if(counter === 3){
        allFolded = true;
    }
    return allFolded;
}

//-----------------------------
// Betting / Folding functions
//-----------------------------

let pot = 0;
// Players must match this bet
let matchedBet = 0;

// x is the value, y is the value to compare to
function compareSetMatchedBet(amn, y){
    if(amn > y){
        matchedBet = amn;
    }
}

// Betting function containing argument for the player
function gameBetFunc(player, fixedVal){
    player.currentTurn = true;
    let x = document.getElementById("input1");
    let y = Number(x.value);

    compareSetMatchedBet(y, matchedBet);
    if(fixedVal === false) {
        if (y < matchedBet) {
            console.log("Cannot bet");
        }
    }
    else {
        if(fixedVal === true){
            player.bet(matchedBet);
        }
        else {
            player.bet(y);
        }
        pot += player.betAmount;
        playerActionDisplay(player);
        player.betAmount = 0;
        displayPlayerAttribute(playerArray[playerTurn].pocket, playerTurn, "Chips: ");
        displayAllNames(false);
        elementReplaceText("potAmn", pot.toString());
        nextPlayerTurn();
    }
}

// Actual betting function used in the page
function trueBetFunc(){
    if((gameTurn!==6)&&(playerTurn === 0)){
        gameBetFunc(playerArray[playerTurn]);
    }
}

// Folding function containing argument for the player
function gameFoldFunc(player){
    player.currentTurn = true;
    player.fold();
    playerActionDisplay(player);
    displayPlayerAttribute(playerArray[playerTurn].pocket, playerTurn, "Chips: ");
    displayAllNames(false);
    nextPlayerTurn();
}

// Actual folding function used in page
function trueFoldFunc(){
    if((gameTurn!==6)&&(playerTurn === 0)) {
        gameFoldFunc(playerArray[playerTurn]);
    }
}

// Checking function containing player argument
function gameCheckFunc(player){
    player.currentTurn = true;
    player.check();
    playerActionDisplay(player);
    displayPlayerAttribute(playerArray[playerTurn].pocket, playerTurn, "Chips: ");
    displayAllNames(false);
    nextPlayerTurn();
}

// Actual checking function containing player argument
function trueCheckFunc(){
    let a = playerArray;

    // Must be at least flop round to check
    if ((gameTurn >= 3)&&(gameTurn!==6)){
        if (playerTurn >= 1) {
            if ((a[playerTurn - 1].actionDone === 3)||(a[playerTurn - 1].actionDone === 2)) {
                gameCheckFunc(a[playerTurn]);
            }
        } // Separate conditional required to check specifically for playerTurn = 0
        // Can't use a for loop here as it must be checked on each player's turn, not all at once
        else if (playerTurn === 0) {
            gameCheckFunc(a[playerTurn]);
        }
    }

    else{
        console.log("You can't check!");
    }

}



//-----------------------------
// Game Event Handler
//-----------------------------

// One time function to start the game
function beginGame(){
    removeElement("begin");
    drawHands();
    drawDeck();
    displayAllPockets();
    displayAllNames(true);
    displayCurrentPlayerTurn();
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
function nextRound() {
    gameTurn++;

    async function delayAction() {
        if (gameTurn === 6) {
            // Determines the hands of all the players
            giveAllHandRanks();

            // Shows all the players' hands before doing the rest
            debugger;
            displayAllHands();
            await sleep(5000);

            // Determine the winner by the hand ranks of every player
            givePot();
            pot = 0;
            matchedBet = 0;
            document.getElementById("potAmn").innerHTML = pot.toString();

            // Eliminates players who have lost
            eliminatePlayer();

            // Checks if there is a winner, and displays them
            if (playerArray.length === 1) {
                showGameWinner();
            } else {
                // Resets all values
                gameTurn = 2;

                // Removes and displays new random deck
                fullClearCanvas();
                discardAll();
                displayRandomDeck();
                displayAllPockets();
                displayAllNames(true);

                for (let i = 0; i < playerArray.length; i++) {
                    let x = playerArray[i];
                    drawAll = true;
                    x.holeCards = [];
                    x.actionReset();
                    x.handDrawn = false;
                }
                drawHands();
            }
        } else {
            declareRoundNames();
            updateCanvas();
        }
        displayCurrentPlayerTurn();
        // Clears all actions taken by players
        resetAllPlayerActions();
    }
    delayAction();
}

// Declares the round names
function declareRoundNames(){
    if (gameTurn === 2){
        elementReplaceText("round","Pre-Flop");
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



//-----------------------------
//  Checking hand rankings
//-----------------------------

// Class used to create an object storing the suit/rank name and the amount of them
class cardComparatorArray{
    constructor(name) {
        this.name = name;
        this.amount = 0;
    }
}

// Initialises cardComparatorArray instances
function initCCArray(){
    // Count all instances of a suit or rank
    let a = ["noSpades","noClubs","noDiamonds","noHearts"];
    let b = ["no1s","no2s","no3s","no4s","no5s","no6s","no7s","no8s","no9s","no10s","noJs","noQs","noKs"];

    // Holds above values
    let c = [];
    c.push(...a, ...b);
    // Holds array of objects
    let d = [];

    for(let i = 0; i<c.length;i++){
        let e = new cardComparatorArray(c[i]);
        d.push(e);
    }
    return d;
}

// x is the player hand, y is the community cards
function createHandArray(x, y){
    let cardArray = [];
    cardArray.push( ...x.holeCards, ...y);
    return cardArray;
}

// Shows the best hand made
// i is a value to iterate by
function determineHands(i){
    // Declares fresh CCarray
    let a = initCCArray();
    cardTypeCounter(createHandArray(playerArray[i], commCards), a);
    return identifyBestHands(a);
}

// Compares the cards and increments values as required
// x is the temp2 array with the hand (7 cards) and y is the CC array
function cardTypeCounter(x,y){
    for(let i = 0; i < x.length;i++){
        switch (x[i].suit) {
            case "Spades":y[0].amount++;break;
            case "Clubs":y[1].amount++;break;
            case "Diamond":y[2].amount++;break;
            case "Hearts":y[3].amount++;break;
        }
        switch (x[i].rank) {
            case "Ace":y[4].amount++;break;
            case "2":y[5].amount++;break;
            case "3":y[6].amount++;break;
            case "4":y[7].amount++;break;
            case "5":y[8].amount++;break;
            case "6":y[9].amount++;break;
            case "7":y[10].amount++;break;
            case "8":y[11].amount++;break;
            case "9":y[12].amount++;break;
            case "10":y[13].amount++;break;
            case "Jack":y[14].amount++;break;
            case "Queen":y[15].amount++;break;
            case "King":y[16].amount++;break;
        }
    }
}


// Compares the cards
// X is the CC array with updated values
function identifyBestHands(x){

    let allSuits = false;
    let allRanks = false;

    // Checks if there are 5 cards of the same suit
    function checkAllSuits(){
        for(let i = 0; i<4; i++){
            if(x[i].amount >= 5){
                allSuits = true;
            }
        }
    }

    // Checks if there are n consecutive cards (does not wrap around, only exception is royal flush)
    function checkAllRanks(n){
        let consecCards = 0;
        for(let i = 4; i < 13; i++){
            if((x[i].amount >= 1)&&(x[i+1].amount >= 1)&&(x[i+2].amount >= 1)&&(x[i+3].amount >= 1)&&(x[i+4].amount >= 1)){ // For n cards, you only need n-1 comparisons
                consecCards++;
            }
        }
        if(consecCards === n){
            allRanks = true;
        }
    }

    // Checks if there are n cards of the same rank
    // highest is a boolean that lets the user choose whether they want to choose the highest card or not
    function checkNCards(n, highest){
        let temp = 0;
        if(highest === true){
            for (let i = 4; i < x.length; i++) {
                if (x[i].amount >= 1) {
                        temp = i-3;
                }
            }
            return temp;
        }
        else{
            for (let i = 4; i < x.length; i++) {
                if (x[i].amount >= n) {
                    return n;
                }
            }
        }
    }

    // Checks for pairs
    function checkNPairs(){
        let innerCounter = 0;
        for (let i = 4; i < x.length; i++) {
            if (x[i].amount >= 2) {
                innerCounter++;
            }
        }
        if(innerCounter >= 2){
            return "2pair";
        }
        else if(innerCounter === 1){
            return "1pair";
        }
    }

    // Check for 3 of a card, and then a pair of cards
    function check3c2p(){
        let firstCounter = false;
        for(let i = 4; i < x.length;i++){
            if(x[i].amount >= 3){
                firstCounter = true;
                for(let j = i+1; j < x.length;j++) {
                    if(x[j].amount >= 2){
                        return true
                    }
                }
            }
        }
    }

    // Checks for Ace, 10, Jack, Queen, and King (Royal flush only)
    function checkSpecificCards(x){
       if(x[4].amount >=1){
           if(x[13].amount >=1){
               if(x[14].amount >=1){
                   if(x[15].amount >=1){
                       if(x[16].amount >=1){
                           return true;
                       }
                   }
               }
           }
       }
    }

    // Ensures only 1 message is output at once
    let outOnce = false;

    // Global variable to store rank
    let handRank = 0;

    // Takes in a string arg and outputs it if outOnce === false
    function outOnceFunc(string, rank){
        if (outOnce === false){
            console.log(string);
            outOnce = true;
            handRank = rank;
        }
    }

    // --------------------------------------------------------------------------------//

    // Royal flush - Rank 1
    function checkRoyalFlush(){
        checkAllSuits();
        if(allSuits === true){
            if(checkSpecificCards(x) === true){
                outOnceFunc("Royal Flush", 1);
            }
        }
    }
    // checkRoyalFlush();

    // Straight flush - Rank 2
    function checkStraightFlush(){
        checkAllSuits();
        checkAllRanks(1);
        if((allRanks === true) && (allSuits === true)){
            outOnceFunc("Straight Flush", 2);
        }
    }
    // checkStraightFlush();

    // 4 of a kind - Rank 3
    function check4kind(){
        let a = checkNCards(4, false);
        if(a===4){
            outOnceFunc("4 of a kind",3 );
        }
    }
    // check4kind();

    // Full house -  Rank 4
    function checkFullHouse(){
        let a = check3c2p();
        if(a === true){
            outOnceFunc("Full house", 4);
        }
    }
    // checkFullHouse();

    // Flush - Rank 5
    function checkFlush(){
        checkAllSuits();
        if((allSuits === true) && (allRanks === false)){
            outOnceFunc("Flush", 5);
        }
    }
    // checkFlush();

    // Straight - Rank 6
    function checkStraight(){
        checkAllRanks(1);
        if((allSuits === false)&&(allRanks === true)){
            outOnceFunc("Straight", 6);
        }
    }
    // checkStraight();

    // 3 of a kind - Rank 7
    function check3kind(){
        let a = checkNCards(3, false);
        if(a===3){
            outOnceFunc("3 of a kind", 7);
        }
    }
    // check3kind();

    // 2 pairs - Rank 8
    function check2pairs(){
        let a = checkNPairs();
        if(a === "2pair"){
            outOnceFunc("2 pairs", 8);
        }
    }
    // check2pairs();

    // 1 pair - Rank 9
    function checkPair(){
        let a = checkNPairs();
        if(a === "1pair"){
            outOnceFunc("1 pair", 9);
        }
    }
    // checkPair();

    // High Card - Rank 10
    function checkHighCard(){
        let a = checkNCards(0, true);
        switch(a){
            default:
                outOnceFunc(a + " high card",10.4-((1/100)*a));
                break;
            case 1:
                outOnceFunc("Ace high card",10.5);
                break;
            case 11:
                outOnceFunc("Jack high card",10.2);
                break;
            case 12:
                outOnceFunc("Queen high card", 10.1);
                break;
            case 13:
                outOnceFunc("King high card",10);
                break;
        }
    }
    // checkHighCard();

    // --------------------------------------------------------------------------------//

    // Executes all checking functions
    function execAllChecks(){
        checkRoyalFlush();
        checkStraightFlush();
        check4kind();
        checkFullHouse();
        checkFlush();
        checkStraight();
        check3kind();
        check2pairs();
        checkPair();
        checkHighCard();
    }
    execAllChecks();

    // Returns the value of handRank so it can be assigned to each player
    return handRank;
}




//-----------------------------
//  Winning And Elimination
//-----------------------------

// Compares each user's hand to each other and returns a winner (or winners)
function comparePlayerHands(){
    let x = playerArray;
    let winner = [];
    let temp = [];
    for(let i = 0; i < x.length; i++){
        temp.push(x[i].handRank);
    }

    // Removes all hands with hand rank 0 (folded hands)
    function removeZero(){
        let i= 0;
        while(i<temp.length){
            if(temp[i] === 0){
                temp.splice(i, 1);
            }
            else{
                i++;
            }
        }
    }
    removeZero();

    let currentHighest = Math.min.apply(null, temp);

    for(let j = 0; j < x.length; j++){
        if((x[j].handRank === currentHighest)&&(x[j].handRank !== 0)){
            winner.push(x[j]);
        }
    }
    return winner;
}

// Determines the hands of all the players
function giveAllHandRanks(){
    let i = 0;
    while(i<playerArray.length){
        let a = playerArray[i];
        if(a.holeCards.length === 2) {
            a.handRank = determineHands(i);
            i++;
        }
        else{
            i++;
        }
    }
}

// Sets the isRoundWinner of the winning players to true
function setWinners(){
    let a = comparePlayerHands();
    let b =[];
    for(let i = 0; i < playerArray.length; i++){
        for(let j = 0; j < a.length; j++) {
            if (playerArray[i].igName === a[j].igName) {
                playerArray[i].isRoundWinner = true;
                b.push(playerArray[i].igName);
            }
        }
    }
    elementReplaceText("winner", "Winner(s) of previous round: " + b.toString());
    return a.length;
}

// Gives the winning player the pot money
function givePot(){
    let numWinners = setWinners();
    let splitPot = pot / numWinners;
    for(let i = 0; i < playerArray.length; i++){
        let x = playerArray[i];
        if(x.isRoundWinner === true){
            x.pocket = Math.round(x.pocket + splitPot);
            x.isRoundWinner = false;
        }
    }
}

// Checks if a player has no chips at the end of the round, and if true, eliminates them

function eliminatePlayer(){
    let x = playerArray;
    let a = [];
    let i = 0;
   while(i<playerArray.length){
        if(x[i].pocket === 0){
            console.log(x[i].igName+" is eliminated");
            x[i].isEliminated = true;
            a.push(x[i].igName);
            loserArray.push(x[i]);
            playerArray.splice(i,1);
        }
        else{
            i++
        }
    }
    if(a.length > 0) {
        elementReplaceText("eliminated", "Eliminated: "+a.toString());
    }
}

// Checks if the player has won the round
function showGameWinner() {
    let x = playerArray;
    let y = loserArray.reverse();
    let leaderBoardArray = [];
    if(x.length === 1) {
        leaderBoardArray.push(...x, ...y);
        removeEverything();
        createNewElement("p", "Winner: " + leaderBoardArray[0].igName);
        for(let i = 2; i < 5; i++){
            createNewElement("p",(i).toString() + ". " + leaderBoardArray[i-1].igName);
        }
    }
}


