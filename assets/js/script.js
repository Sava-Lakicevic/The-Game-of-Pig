"use strict";

const init = () => {
    const player1 = {
        containerElement: document.getElementById("player-1-container"),
        totalScoreElement: document.getElementById("player-1-total-score"),
        currentScoreElement: document.getElementById("player-1-current-score"),
        totalScore: 0,
        currentScore: 0,
    };
    const player2 = {
        containerElement: document.getElementById("player-2-container"),
        totalScoreElement: document.getElementById("player-2-total-score"),
        currentScoreElement: document.getElementById("player-2-current-score"),
        totalScore: 0,
        currentScore: 0,
    };

    const maxScore = 100;

    const allDiceClasses = [
        "dice-0",
        "dice-1",
        "dice-2",
        "dice-3",
        "dice-4",
        "dice-5",
        "dice-6",
    ];

    const rollButton = document.getElementById("roll-button");
    const holdButton = document.getElementById("hold-button");

    const diceImage = document.querySelector(".dice-image");

    let player1Turn = true;

    let gameIsActive = false;

    function startGame(event) {
        if (!gameIsActive) {
            // set starting conditions
            gameIsActive = true;
            player1Turn = true;
            player1.containerElement.classList.add("player-active");
            player1.containerElement.classList.remove("player-inactive");
            player1.containerElement.classList.remove("player-won");
            player1.totalScoreElement.textContent = 0;
            player1.currentScoreElement.textContent = 0;
            player1.totalScore = 0;
            player1.currentScore = 0;

            player2.containerElement.classList.add("player-inactive");
            player2.containerElement.classList.remove("player-active");
            player2.containerElement.classList.remove("player-won");
            player2.totalScoreElement.textContent = 0;
            player2.currentScoreElement.textContent = 0;
            player2.totalScore = 0;
            player2.currentScore = 0;

            diceImage.classList.remove("game-starter");
            diceImage.textContent = "";
            diceImage.classList.add("dice-0");

            rollButton.disabled = false;
            holdButton.disabled = false;
        }
    }

    function removeDiceImage() {
        allDiceClasses.forEach((diceClass) => {
            diceImage.classList.remove(diceClass);
        });
    }

    function gameOver(activePlayer) {
        gameIsActive = false;
        // update the total and current score
        activePlayer.totalScoreElement.textContent =
            activePlayer.totalScore + activePlayer.currentScore;
        activePlayer.currentScoreElement.textContent = 0;
        // disable the roll and hold buttons
        rollButton.disabled = true;
        holdButton.disabled = true;
        removeDiceImage();
        // display the proper text to play again
        diceImage.classList.add("game-starter");
        diceImage.textContent = "Play again";
        // display who won the game
        activePlayer.containerElement.classList.remove("player-active");
        activePlayer.containerElement.classList.add("player-won");
    }

    function calculateScore(activePlayer, diceNumber) {
        activePlayer.currentScore += diceNumber;
        // check if the total score with the current score is above 100
        if (activePlayer.currentScore + activePlayer.totalScore >= maxScore) {
            gameOver(activePlayer);
        } else {
            activePlayer.currentScoreElement.textContent =
                activePlayer.currentScore;
        }
    }

    function changePlayer() {
        if (player1Turn) {
            player1.currentScore = 0;
            player1.currentScoreElement.textContent = 0;
            player1.containerElement.classList.remove("player-active");
            player1.containerElement.classList.add("player-inactive");
            player2.containerElement.classList.add("player-active");
            player2.containerElement.classList.remove("player-inactive");
        } else {
            player2.currentScore = 0;
            player2.currentScoreElement.textContent = 0;
            player2.containerElement.classList.remove("player-active");
            player2.containerElement.classList.add("player-inactive");
            player1.containerElement.classList.add("player-active");
            player1.containerElement.classList.remove("player-inactive");
        }
        // if true, make false
        // if false, make true
        player1Turn = !player1Turn;
    }

    function rollDice(event) {
        // Getting a random value between 1 and 6
        const diceNumber =
            Math.trunc(Math.random() * (allDiceClasses.length - 1)) + 1;
        removeDiceImage();
        diceImage.classList.add(allDiceClasses[diceNumber]);
        // change the player if he received a 1
        if (diceNumber === 1) {
            changePlayer();
        }
        // Calculate the score of the active player
        else if (player1Turn) {
            calculateScore(player1, diceNumber);
        } else {
            calculateScore(player2, diceNumber);
        }
    }

    function addCurrentToTotal(activePlayer) {
        if (activePlayer.currentScore === 0) {
            return false;
        }
        activePlayer.totalScore += activePlayer.currentScore;
        activePlayer.totalScoreElement.textContent = activePlayer.totalScore;
        return true;
    }

    function holdScore(event) {
        let changeApproved;
        if (player1Turn) {
            changeApproved = addCurrentToTotal(player1);
        } else {
            changeApproved = addCurrentToTotal(player2);
        }
        if (changeApproved) {
            removeDiceImage();
            diceImage.classList.add("dice-0");
            changePlayer();
        }
    }

    return {
        startGame: startGame,
        rollDice: rollDice,
        holdScore: holdScore,
    };
};

const game = init();

document
    .querySelector(".game-starter")
    .addEventListener("click", game.startGame);
document.getElementById("roll-button").addEventListener("click", game.rollDice);
document
    .getElementById("hold-button")
    .addEventListener("click", game.holdScore);
