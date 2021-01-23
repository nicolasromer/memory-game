import CardSet from "../elements/CardSet.js";

const gameSizes = [4,8,12];

/*
 type State {
    score: number,
    gameSize: number,
    cardNumbers: Array<number>,
 }
 */

class Game {
    game /* Generator */;

    instructionDiv
    cardSet;
    buttonDiv;

    constructor(container) {
        this.instructionDiv = document.getElementById('instruction');
        this.cardSet = new CardSet(document.getElementById('card-set'));
        this.buttonDiv = document.getElementById('button');
    }

    /* public */
    startNew() {
        this.hideButton();
        this.game = this.turnManager();
        this.game.next();
    }

    /* rest are private */

    async * turnManager(state = {}) {
        this.chooseGameSizeStep(state);
        this.memorizationStep(yield);
        this.guessingStep(yield);
        this.reviewScoreStep(yield);
    }

    chooseGameSizeStep(state) {
        this.setInstruction('How many cards can you remember?');
        this.cardSet.insertCards(gameSizes);

        const cards = this.cardSet.getCards();

        cards.forEach(card => card.$node.addEventListener("click", e => {
            const number = card.getNumber();

            this.cardSet.removeCards();

            const newState = {...state, gameSize: number};
            this.game.next(newState);
        }));
    }

    async memorizationStep(state) {
        this.setInstruction('Loading cards...');

        const cardCount = state.gameSize;
        const cardResponse = await fetch('/cards/' + cardCount);
        const cards = await cardResponse.json();

        this.setInstruction('Okay now, memorize these cards!');

        this.cardSet.insertCards(cards);

        const newState = {...state, cardNumbers: cards};

        this.setButton("I'm Ready");
        this.buttonDiv.onclick = () => {
            this.hideButton();
            this.game.next(newState);
        }
    }

    guessingStep(state) {
        this.setInstruction('Now, click the cards in order, from lowest to highest.');

        this.cardSet.flipDownCards();

        let score = 0
        const addPoint = () => score += 1;

        const endRound = () => {
            this.cardSet.removeCards();
            this.game.next({...state, score});
        }

        this.cardSet.activateCardsForPlay(endRound, addPoint);

        this.setButton('I Give Up :(');
        this.buttonDiv.onclick = () => {
            endRound()
        }
    }

    reviewScoreStep({score, gameSize}) {
        this.setInstruction('Your score is:');

        this.cardSet.showScore(score, gameSize);

        this.buttonDiv.innerHTML = "<button>Again, again!</button>";
        this.buttonDiv.onclick = () => {
            this.startNew()
        }
    }

    /* helpers */
    setInstruction(text) {
        this.instructionDiv.innerHTML = `<p>${text}</p>`;
    }

    setButton(label) {
        this.buttonDiv.innerHTML = `<button>${label}</button>`;
    }

    hideButton() {
        this.buttonDiv.innerHTML = '';
    }
}

export default Game
