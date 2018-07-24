
const deck = document.querySelector('.deck');
const closeModal = document.querySelector('.modal-close');
const replayButton = document.querySelector('.modal-replay');
let cardList = [];  //cards to be checked for match
let moves = 0;  //Clear moves counter. 1 pair of cards checked = 1 move
let duration = 0, timerId;
let timerOn = false;



/* Shuffle deck */
shuffleCards();

function resetGame() {
    resetTime();
    resetMoves();
    resetStars();
    shuffleCards();
}

function resetTime() {
    stopTimer();
    duration = 0;
    displayTime();
}

function resetMoves() {
    moves = 0;
    document.querySelector('.moves').textContent = moves;
}

function resetStars() {
    const stars = document.getElementsByClassName('fa-star');

    for (let star of stars) {
        if (star.style.visibility === 'hidden') {
            star.style.visibility = 'visible';
        break;
        }
    }
}


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function shuffleCards() {
    /* Create an array of cards from node list */
    const cardsArray = [].slice.call(document.querySelectorAll('.card')); 
    const shuffledCards = shuffle(cardsArray);

    for (card of shuffledCards) {
        deck.appendChild(card);
    }
}

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

/* Opens a clicked card by toggling a class name on or off */
function toggleView(clicked) {
    clicked.classList.toggle('open');
    clicked.classList.toggle('show');
}

/* Adds a clicked card to be checked against pair (push to array). (Max of 2 cards) */
function addCard(clicked) {
    cardList.push(clicked);
    //console.log(cardList);
    
}

/* Checks card pair for match - must hav same class names */
function checkMatch() {
    if (cardList[0].firstElementChild.className === cardList[1].firstElementChild.className) {  //check if the two cards have matching class
        //console.log("It's a match!"); 
        cardList[0].classList.toggle('match');  //if so, leave two cards open
        cardList[1].classList.toggle('match');
        clearCardList(cardList);
    } else {
        setTimeout(function () {    // allows non-match clicked cards to display briefly 
            //console.log("Not a match :(");   
            toggleView(cardList[0]);
            toggleView(cardList[1]);
            clearCardList(cardList);
        }, 1000);
    }
    
    return cardList;     //clear the array and return it
}

/* "Clears" selected and checked card pair */
function clearCardList(cards) {
    cards.length = 0;   // Set array length = 0 to "clear" it
    return cards;
}


function addMove() {
    moves++;
    const movesDisplay = document.querySelector('.moves');
    
    if (moves === 1) {
        movesDisplay.nextSibling.textContent = " Move";
    } else {
        movesDisplay.nextSibling.textContent = " Moves";
    }
    movesDisplay.textContent = moves;
    return moves;

}

function checkMoves() {
    if (moves === 8 || moves === 24 || moves === 32) {
        removeStar();
    }
       
}

function removeStar() {
    const stars = document.querySelectorAll('.score-panel .stars li');
    
    for (const star of stars) {
        if (!(star.style.visibility === 'hidden')) {
            star.style.visibility = 'hidden';
        break;
        }
    
    }

}

function startTimer() {
    timerId = setInterval( function() {
        duration++;
        displayTime();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
    timerOn = false;
    duration = 0;   //reset clock
}


function displayTime() {
    const timer = document.querySelector('.timer');
    let sec = duration % 60;
    let min = Math.floor(duration / 60);

    if (sec < 10) {
        timer.textContent = `${min}:0${sec}`;
    } else {
        timer.textContent = `${min}:${sec}`;
    }
}

function toggleModal() {
    const modal = document.getElementById('openModal');
    modal.classList.toggle('hide');
}

function displayStats() {
    const timeDisplay = document.querySelector('#statsTime');
    const movesDisplay = document.querySelector('#statsMoves');
    const starsDisplay = document.querySelector('#statsStars');
    let timeStats = document.querySelector('.timer').innerText;
    let movesStats = document.querySelector('.moves').innerText;
    let starsStats = getStars();

    timeDisplay.textContent = `${timeStats}`;
    movesDisplay.textContent = `${movesStats}`;
    starsDisplay.textContent = `${starsStats}`;

}

function getStars() {
    const finalStars = document.querySelectorAll('.stars li');
    let finalStarCount = 0;

    for (star of finalStars) {
        if (!(star.style.visibility === 'hidden')) {
            finalStarCount++;
        }
    }
    return finalStarCount;
}

closeModal.addEventListener('click', function() {
        toggleModal();
    }
)

replayButton.addEventListener('click', function() {
        toggleModal();
        resetGame();
});

/*  No event handler if:
        -element clicked on is not a card
        -card clicked on is an already matched card
        -card clicked on is an already open card
    Conditional added to prevent more than 3 cards at a time from being opened, added
        to cardList array and checked for match
    Conditional added that will check clicked cards and count as one complete
        move if there are exactly 2 cards in cardList
*/
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

     if (li.classList.contains('open') || li.classList.contains('show')) {
        return;
     }

    if ((cardList.length < 2) && (!cardList.includes(li))) {
        if (!timerOn) {
            startTimer();
            timerOn = true;
        }
        toggleView(li);
        addCard(li);
        
    }

    if (cardList.length === 2) {
        checkMatch();
        addMove();
        checkMoves();
    }
});

document.querySelector('.restart').addEventListener('click', resetGame);

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
