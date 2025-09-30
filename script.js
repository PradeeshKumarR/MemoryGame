/**
 * Memory Game JavaScript
 * - Follows modern best practices (ES6+)
 * - Accessible, responsive, and well-commented
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM element references
    const gameBoard = document.getElementById("game-board");
    const restartBtn = document.getElementById("restart-btn");
    const moveCountDisplay = document.getElementById("move-count");

    // Card values (8 pairs, 16 cards)
    const CARD_VALUES = [
        "A", "A", "B", "B", "C", "C", "D", "D",
        "E", "E", "F", "F", "G", "G", "H", "H"
    ];

    let flippedCards = [];
    let matchedCards = [];
    let moveCount = 0;
    let isBoardLocked = false;

    /**
     * Shuffle an array in-place using Fisher-Yates algorithm
     * @param {Array} array
     */
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Create and render the game board with shuffled cards
     */
    function createGameBoard() {
        // Shuffle card values for a new game
        const shuffledValues = [...CARD_VALUES];
        shuffle(shuffledValues);

        // Clear previous board
        gameBoard.innerHTML = "";
        flippedCards = [];
        matchedCards = [];

        // Create card elements
        shuffledValues.forEach((value, idx) => {
            const card = document.createElement("button");
            card.className = "card";
            card.type = "button";
            card.setAttribute("data-value", value);
            card.setAttribute("aria-label", "Hidden card");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-pressed", "false");
            card.setAttribute("data-index", idx);

            // Card click event
            card.addEventListener("click", () => handleCardFlip(card));
            card.addEventListener("keydown", (e) => {
                // Allow flipping with Enter/Space for accessibility
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardFlip(card);
                }
            });

            gameBoard.appendChild(card);
        });
    }

    /**
     * Handle flipping a card
     * @param {HTMLElement} card
     */
    function handleCardFlip(card) {
        if (
            isBoardLocked ||
            flippedCards.includes(card) ||
            matchedCards.includes(card)
        ) {
            return;
        }

        // Reveal card
        card.classList.add("flipped");
        card.textContent = card.getAttribute("data-value");
        card.setAttribute("aria-label", `Card: ${card.getAttribute("data-value")}`);
        card.setAttribute("aria-pressed", "true");
        flippedCards.push(card);

        // Only increment move count on first or second flip in a pair
        if (flippedCards.length === 1 || flippedCards.length === 2) {
            moveCount++;
            moveCountDisplay.textContent = moveCount;
        }

        // Check for match if two cards are flipped
        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    /**
     * Check if the two flipped cards match
     */
    function checkForMatch() {
        isBoardLocked = true;
        const [card1, card2] = flippedCards;

        if (card1.getAttribute("data-value") === card2.getAttribute("data-value")) {
            // Match found
            card1.classList.add("matched");
            card2.classList.add("matched");
            matchedCards.push(card1, card2);

            // Remove focusability from matched cards
            card1.setAttribute("tabindex", "-1");
            card2.setAttribute("tabindex", "-1");

            flippedCards = [];
            isBoardLocked = false;

            // Check for game completion
            if (matchedCards.length === CARD_VALUES.length) {
                setTimeout(() => {
                    alert("Congratulations! You matched all pairs!");
                }, 400);
            }
        } else {
            // No match: shake and hide after delay
            card1.classList.add("shake");
            card2.classList.add("shake");

            setTimeout(() => {
                [card1, card2].forEach((card) => {
                    card.classList.remove("flipped", "shake");
                    card.textContent = "";
                    card.setAttribute("aria-label", "Hidden card");
                    card.setAttribute("aria-pressed", "false");
                });
                flippedCards = [];
                isBoardLocked = false;
            }, 900);
        }
    }

    /**
     * Restart the game
     */
    function restartGame() {
        moveCount = 0;
        moveCountDisplay.textContent = moveCount;
        createGameBoard();
    }

    // Event listeners
    restartBtn.addEventListener("click", restartGame);

    // Initialize game on page load
    moveCountDisplay.textContent = moveCount;
    createGameBoard();
});
