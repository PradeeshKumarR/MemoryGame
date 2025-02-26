document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("game-board");
    const restartBtn = document.getElementById("restart-btn");
    const moveCountDisplay = document.getElementById("move-count");
    const cardValues = ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F", "G", "G", "H", "H"];
    let flipCards = [];
    let matchedCards = [];
    let moveCount = 0; // The number of moves made by the players is tracked and displayed at the top of the screen.
    let isBoardLocked = false;
    moveCountDisplay.innerHTML = moveCount;

    // Function to shuffle the cards
    function shuffleCards() {
        for (let i = 0; i < cardValues.length; i++) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [cardValues[i], cardValues[randomIndex]] = [cardValues[randomIndex], cardValues[i]];
        }
    }

    // Function to create the game board
    function createGameBoard() {
        shuffleCards();
        gameBoard.innerHTML = "";
        cardValues.forEach((value, index) => {
            const card = document.createElement("div");
            card.setAttribute("id", index);
            card.setAttribute("value", value);
            card.classList.add("card");
            gameBoard.appendChild(card);
            card.addEventListener("click", flipCard);
        })
    }

    // Function to flip a card
    function flipCard() {
        if (isBoardLocked === true) {
            return
        } else if (flipCards.includes(this) || matchedCards.includes(this)) {
            return
        } else {
            this.classList.add("flipped");
            this.innerHTML = this.getAttribute("value");
            flipCards.push(this);
            moveCount++;
            moveCountDisplay.innerHTML = moveCount;
            if (flipCards.length === 2) {
                checkMatch();
            }
        }
    }

    // Function to check if the flipped cards match
    function checkMatch() {
        isBoardLocked = true;
        const [card1, card2] = flipCards;
        if (card1.getAttribute("value") === card2.getAttribute("value")) {
            card1.classList.add("matched");
            card2.classList.add("matched");
            matchedCards.push(card1, card2);
            if (matchedCards.length === cardValues.length) {
                setTimeout(() => { alert("You won! The game is over."); }, 300)
            }
        } else {
            card1.classList.add("shake");
            card2.classList.add("shake");
            setTimeout(() => {
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
                card1.classList.remove("shake");
                card2.classList.remove("shake");
                card1.innerHTML = "";
                card2.innerHTML = "";
            }, 1000)
        }
        flipCards = [];
        isBoardLocked = false;
    }

    function restartGame() {
        flipCards = [];
        matchedCards = [];
        isBoardLocked = false;
        moveCount = 0;
        moveCountDisplay.innerHTML = moveCount;
        createGameBoard();
    }

    restartBtn.addEventListener("click", restartGame);

    createGameBoard();
})
