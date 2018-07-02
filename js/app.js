
const deck = document.querySelector('.deck');

let cardList = [];
/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function toggleView(clicked) {
    clicked.classList.toggle('open');
    clicked.classList.toggle('show');
}

function addCard(clicked) {
    cardList.push(clicked);
    //console.log(cardList);
    
}

function checkMatch() {
    if (cardList[0].firstElementChild.className === cardList[1].firstElementChild.className) {  //check if the two cards have matching class
        //console.log("It's a match!"); 
        cardList[0].classList.toggle('match');  //if so, leave two cards open
        cardList[1].classList.toggle('match');
        clearCardList(cardList);
    } else {
        setTimeout(function () {    
            //console.log("Not a match :(");   
            toggleView(cardList[0]);
            toggleView(cardList[1]);
            clearCardList(cardList);
        }, 1000);
    }
    
    return cardList;     //clear the array and return it
}

function clearCardList(cards) {
    cards.length = 0;
    return cards;
}

deck.addEventListener('click', function(e) {
    let li = event.target.closest('li');
    

    if (!li) {
        return;
    }
    
    if (!li.classList.contains('card')) {
       return;
    }

    if (li.classList.contains('match')) {
        return;
     }

    if ((cardList.length < 2) && (!cardList.includes(li))) {
        toggleView(li);
        addCard(li);
        
    }

    if (cardList.length === 2) {
        checkMatch();
        
    }
});



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
