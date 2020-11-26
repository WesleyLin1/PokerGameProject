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
        debugger;
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
let tutArray = ["Welcome to the tutorial!", "This tutorial will teach you the basics of playing Texas Hold'em Poker"];


function tutinstruct(){
    let div = document.getElementById("tuttext");
    div.remove();
    step += 1;
    let x = document.createElement("P"); // Maybe change to div later after canvas implementation
    let text = document.createTextNode(tutArray[step]);
    x.setAttribute("id", "tuttext");
    x.appendChild(text);
    document.body.appendChild(x);
}