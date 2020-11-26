/*
Cards are numerically  ordered from 0-11 in an array for their respective suit, with 0 being the Ace and 11 being the King
In the img folder, it goes spades (0-12), clubs (13-25), diamonds (26-38), hearts (39-51)
It is zero-based so I can utilise iterative formulas to generate a deck arrangement
*/
// Declares deck of cards
let spades = [0,1,2,3,4,5,6,7,8,9,10,11,12];
let clubs = [13,14,15,16,17,18,19,20,21,22,23,24,25];
let diamonds = [26,27,28,29,30,31,32,33,34,35,36,37,38];
let hearts = [39,40,41,42,43,44,45,46,47,48,49,50,51];
let deck = spades.concat(clubs,diamonds,hearts);
console.log(deck);

// Adds images of cards
function addimg() {
    for (let i=0; i<deck.length; i++){
        //debugger;
        let x = document.createElement("img");
        x.setAttribute("src","../client/img/" + i +".png" );
        x.setAttribute("width", "65");
        x.setAttribute("height", "100");
        x.setAttribute("alt", "card");
        document.body.appendChild(x);
    }
}

// Declare variables to read into tutinstruct() function to iterate text boxes
let step = -1;
let tutArray = ["Welcome to the tutorial!"
    , "This tutorial will teach you the basics of playing Texas Hold'em Poker."
    ,"The objective of the game is to win chips by having a better 5-card poker hand than other players from any combination of the community cards and your hand."
    ,"Each round of poker consists of 4 turns: the pre-flop, flop, turn, and river. Players can bet chips during these rounds."
    ,"Firstly, we shall start in the first round, the pre-flop."
    ,"The player with the BB button, standing for Big Blind, bets the minimum amount for that round, and incentivizes others to bet and increase the pot. For the sake of simplicity, we will not include the BB button."
    ,"Since we have a strong hand, we should raise and make the other players bet more. In most cases, raising the betting amount is not recommended before the flop, since you don’t know what cards will be played."
    ,"If our hand was weak, then we would fold; that is, we would give up our hand to the dealer and decline to play in the current round."
    , "Calling - matching a previous bet; Raising - betting a higher amount than the previous bet; Folding - forfeiting your hand and sitting out of the current round; All-in - bet all your chips"
    ,"On the flop round, 3 community cards are shown, and the betting continues. We should continue to call bets since our hand is very strong; we have a flush, which consists of a hand of 5 cards with the same suit."
    ,"This is the turn, where 1 more card is added to the community cards. Since our hand is very strong, we should continue with our plan of calling bets."
    , "This is the river. There’s one more player left, and they seem to be pretty confident, since they haven't folded yet. Let’s all-in and see if he’s brave enough to challenge us!"
    , "Unfortunately for him, we had the upper hand!"];

// Declare pot outside so the value is not reset to 0
let pot = 0;
let chips = 1000;
function tutinstruct(){

    // Changes "Start tutorial" button to "Next"
    let tutbutttext = document.getElementById("tutbutt");
    tutbutttext.innerHTML = "Next";

    // Sets text in textbox
    let tut = document.getElementById("tuttext");
    tut.remove();
    step += 1;
    let x = document.createElement("p"); // Maybe change to div later after canvas implementation
    let text = document.createTextNode(tutArray[step]);
    x.setAttribute("id", "tuttext");

    if (step >= tutArray.length){ // Appends empty string to avoid appending undefined to the document
        text = document.createTextNode("");
    }
    x.appendChild(text);
    document.body.appendChild(x);

    /* Adds images to divs
    Add hand at step = 4, flop at step = 9, turn at step = 10, river at step = 11 */

    let appendimg = function(i){ // Anonymous function for adding multiple images to divs by bypassing the unique argument restriction
        let handimg= document.createElement("img");
        handimg.setAttribute("src", "../client/img/"+i+".png");
        handimg.setAttribute("width", "65");
        handimg.setAttribute("height", "100");
        handimg.setAttribute("alt", "card");
        return handimg;
    }

    // Hand div

    let chipnode = document.createTextNode("Chips: " + chips);
    let handdiv = document.createElement("div");
    handdiv.setAttribute("id", "handid");
    let handid = document.getElementById("handid");

    if(step == 4){
        for(let i = 26; i < 39; i = i + 12){
            handdiv.appendChild(appendimg(i));
        }
        handdiv.appendChild(chipnode);

        document.body.appendChild(handdiv);
    }

    // Comm card / pot div
    let commdiv = document.createElement("div");
    let potnum = document.createTextNode(""+0);
    commdiv.setAttribute("id", "commdiv");
    let commget = document.getElementById("commdiv");
    let commcardarray = [31, 36, 41, 37, 3];
    let win = false;
    let bet = 0;

    function updatechips(){
        handid.remove();
        if (win == true) {
            chips = chips + pot;
        }
        else {
            chips = chips - bet;
        }
        chipnode.nodeValue = "Chips: "+ (chips).toString();
        for(let i = 26; i < 39; i = i + 12){
            handdiv.appendChild(appendimg(i));
        }
        handdiv.appendChild(chipnode);

        document.body.appendChild(handdiv);
    }

    function potbet(betnum){
        if (betnum == 0){
            pot =0;
        }
        bet  = betnum;
        pot = pot + bet;
    }

    if (step ==6){
        potbet(100);
        updatechips();
        potnum.nodeValue = "Pot: "+pot;
        handdiv.appendChild(chipnode);
        commdiv.appendChild(potnum);
        document.body.append(commdiv)
    }

    if (step == 9){
        commget.remove();
        potbet(100);
        updatechips();
        potnum.nodeValue = "Pot: "+pot;
        commdiv.appendChild(potnum);
        for (let i=0; i < 3; i++){
            commdiv.appendChild(appendimg(commcardarray[i]));
        }
        document.body.append(commdiv);
    }

    if(step == 10){
        commget.remove();
        potbet(100);
        updatechips();
        potnum.nodeValue = "Pot: "+pot;
        commdiv.appendChild(potnum);
        for (let i=0; i < 4; i++){
            commdiv.appendChild(appendimg(commcardarray[i]));
        }
        document.body.append(commdiv);
    }

    if(step == 11){
        commget.remove();
        potbet(700);
        updatechips();
        potnum.nodeValue = "Pot: "+pot;
        commdiv.appendChild(potnum);
        for (let i=0; i < 5; i++){
            commdiv.appendChild(appendimg(commcardarray[i]));
        }
        document.body.append(commdiv);
    }

    if (step == 12){
        commget.remove();
        win = true;
        updatechips();
        potbet(0);
        potnum.nodeValue = "Pot: "+pot;
        commdiv.appendChild(potnum);
        for (let i=0; i < 5; i++){
            commdiv.appendChild(appendimg(commcardarray[i]));
        }
        document.body.append(commdiv);
    }



}