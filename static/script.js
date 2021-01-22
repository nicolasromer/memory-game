// imports are relative to "/static" since they're coming from the server
import Game from '../elements/Game.js';

console.log('script loaded');

// static configuration
const gameSizes = [4,8,12];

// dom references
const instructionDiv = document.getElementById('instruction');
const gameDiv = document.getElementById('game');
const buttonDiv = document.getElementById('button');

const game = new Game(gameDiv);

const setInstruction = instruction => {
    instructionDiv.innerHTML = `<p>${instruction}</p>`;
}

// game steps
const chooseGameSizeStep = (state, nextGameStep) => {
    setInstruction('How many cards can you remember?');
    game.insertCards(gameSizes);

    const cards = game.getCards();

    cards.forEach(card => card.$node.addEventListener("click", e => {
        const number = card.getNumber();

        game.removeCards();

        const newState = {...state, gameSize: number};
        nextGameStep(newState);
    }));
}

const memorizationStep = async (state, nextGameStep) => {
    setInstruction('Loading cards...');

    const cardCount = state.gameSize;
    const cardResponse = await fetch('/cards/' + cardCount);
    const cards = await cardResponse.json();

    setInstruction('Okay now, memorize these cards!');

    game.insertCards(cards);

    const newState = {...state, cardNumbers: cards};

    buttonDiv.innerHTML = "<button>I'm Ready</button>";
    buttonDiv.onclick = () => {
        buttonDiv.innerHTML = '';
        nextGameStep(newState);
    }
}

const guessingStep = (state, nextGameStep) => {
    setInstruction('Now, click the cards in order, from lowest to highest.');

    game.flipDownCards();

    let score = 0
    const addPoint = () => score += 1;

    const endRound = () => {
        game.removeCards();
        nextGameStep({...state, score});
    }

    game.activateCardsForPlay(endRound, addPoint);

    buttonDiv.innerHTML = "<button>I Give Up :(</button>";
    buttonDiv.onclick = () => {
        endRound()
    }
}

const reviewScoreStep = ({score, gameSize}, nextGameStep) => {
    setInstruction('Your score is:');

    game.showScore(score, gameSize);

    buttonDiv.innerHTML = "<button>Again, again!</button>";
    buttonDiv.onclick = () => {
        buttonDiv.innerHTML = '';
        nextGameStep();
    }
}

/*
 TODO: Type definition for State
 type State {
    score: number,
    gameSize: number,
    ...
 }
 */

// TODO: use a generator function here;
// FIXME: this will overflow the stack after enough games without a page refresh
const startGame = async () => {
    chooseGameSizeStep({},
        (state2) => memorizationStep(state2,
            (state3)=> guessingStep(state3,
                (state4) => reviewScoreStep(state4,
                        startGame
                    )
                )
        )
    );
}


window.onload = startGame;