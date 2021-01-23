// imports are relative to "/static" since they're coming from the server
import CardSet from '../elements/CardSet.js';

console.log('script loaded');

// static configuration
const gameSizes = [4,8,12];

// dom references
const instructionDiv = document.getElementById('instruction');
const gameDiv = document.getElementById('game');
const buttonDiv = document.getElementById('button');

const cardSet = new CardSet(gameDiv);

// ToDo: create TurnManager class to house button logic and game phase management
const setInstruction = instruction => {
    instructionDiv.innerHTML = `<p>${instruction}</p>`;
}

/*
 TODO: Type definition for State
 type State {
    score: number,
    gameSize: number,
    ...
 }
 */

async function* steps(state = {}) {
    chooseGameSizeStep(state);
    memorizationStep(yield);
    guessingStep(yield);
    reviewScoreStep(yield);
}

let gameSteps = steps();

window.onload = () => gameSteps.next();


const chooseGameSizeStep = (state) => {
    setInstruction('How many cards can you remember?');
    cardSet.insertCards(gameSizes);

    const cards = cardSet.getCards();

    cards.forEach(card => card.$node.addEventListener("click", e => {
        const number = card.getNumber();

        cardSet.removeCards();

        const newState = {...state, gameSize: number};
        gameSteps.next(newState);
    }));
}

const memorizationStep = async (state) => {
    setInstruction('Loading cards...');

    const cardCount = state.gameSize;
    const cardResponse = await fetch('/cards/' + cardCount);
    const cards = await cardResponse.json();

    setInstruction('Okay now, memorize these cards!');

    cardSet.insertCards(cards);

    const newState = {...state, cardNumbers: cards};

    buttonDiv.innerHTML = "<button>I'm Ready</button>";
    buttonDiv.onclick = () => {
        buttonDiv.innerHTML = '';
        gameSteps.next(newState);
    }
}

const guessingStep = (state) => {
    setInstruction('Now, click the cards in order, from lowest to highest.');

    cardSet.flipDownCards();

    let score = 0
    const addPoint = () => score += 1;

    const endRound = () => {
        cardSet.removeCards();
        gameSteps.next({...state, score});
    }

    cardSet.activateCardsForPlay(endRound, addPoint);

    buttonDiv.innerHTML = "<button>I Give Up :(</button>";
    buttonDiv.onclick = () => {
        endRound()
    }
}

const reviewScoreStep = ({score, gameSize}) => {
    setInstruction('Your score is:');

    cardSet.showScore(score, gameSize);

    buttonDiv.innerHTML = "<button>Again, again!</button>";
    buttonDiv.onclick = () => {
        buttonDiv.innerHTML = '';
        gameSteps = steps();
        gameSteps.next();
    }
}



