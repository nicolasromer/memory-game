console.log('script loaded');

// static configuration
const gameSizes = [4,8,12];
const cardHeight = 200;

// dom references
const instructionDiv = document.getElementById('instruction');
const gameDiv = document.getElementById('game');
const buttonDiv = document.getElementById('button');

class Card {
    $node;

    constructor(domNode) {
        if (!this.isValidCard(domNode)) {
            throw new Error('constructing Card requires a node with data-number and class "card"')
        }
        this.$node = domNode;
    }

    /* private */
    isValidCard(node) {
        return  node.dataset &&
                node.dataset.number &&
                node.className === 'card';
    }

    getNumber() {
        return parseInt(this.$node.dataset.number, 10);
    }

    remove() {
        this.$node.style.height = '10px';
        this.$node.style.color = 'rgb(0, 0, 0, 0)';
        setTimeout(() => this.$node.remove(), 200);
    }

    flipDown() {
        this.$node.style.height = '0px';
        this.$node.style.color = 'rgb(0, 0, 0, 0)';
        setTimeout(()=>{
            this.$node.style.height = cardHeight +'px';
        }, 200);
    }

    flipUp () {
        this.$node.style.height = '0px';
        this.$node.style.color = 'black';
        setTimeout(()=>{
            this.$node.style.height = cardHeight +'px';
        }, 200);
    }
}

// TODO: create Card class with all these functions
const getCardHtml = (number) => (
    // ToDo: make accessible with keyboard
    `<div
        class="card"
        data-number="${number}"
    >
        ${number}
    </div>`
);

// TODO: Create CardSet class to house these functions
const getCards = () => Array.from(document.getElementsByClassName('card'))
    .map(card => new Card(card));

const flipDownCards = () => {
    getCards().forEach((card, index) => {
        setTimeout(() => card.flipDown(), index * 50);
    });
}

const insertCards = (numbers) => {
    gameDiv.innerHTML = numbers.map(number => getCardHtml(number)).join('');
};

const removeCards = () => getCards().forEach(card => card.remove());

const activateCardsForPlay = (onComplete, onPoint) => {
    const hiddenCards = getCards().map(card => card.getNumber());

    getCards().forEach((card /* : Card */, index) => {
        card.$node.addEventListener("click", e => {
            const number = card.getNumber();
            if (isLowest(number, hiddenCards)) {
                card.flipUp();

                // fixme: mutation
                remove(number, hiddenCards);

                onPoint()
            }

            if (!hiddenCards.length) {
                onComplete()
            }
        })
    });
}

const isLowest = (number, set) => number === Math.min(...set);

const remove = (number, set) => set.splice(set.indexOf(number), 1)
// end class CardSet

// could go in a class "Game" along with button functions and main orchestration function
const setInstruction = instruction => {
    instructionDiv.innerHTML = `<p>${instruction}</p>`;
}

// game steps
const chooseGameSizeStep = (state, nextGameStep) => {
    setInstruction('How many cards can you remember?');
    insertCards(gameSizes);

    const cards = getCards();

    cards.forEach(card => card.$node.addEventListener("click", e => {
        const clickedCard = new Card(e.target);
        const number = clickedCard.getNumber();
        cards.forEach(card => card.remove);

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

    insertCards(cards);

    const newState = {...state, cardNumbers: cards};

    buttonDiv.innerHTML = "<button>I'm Ready</button>";
    buttonDiv.onclick = () => {
        buttonDiv.innerHTML = '';
        nextGameStep(newState);
    }
}

const guessingStep = (state, nextGameStep) => {
    setInstruction('Now, click the cards in order, from lowest to highest.');

    flipDownCards();

    let score = 0
    const addPoint = () => score += 1;

    const endRound = () => {
        removeCards();
        nextGameStep({...state, score});
    }

    activateCardsForPlay(endRound, addPoint);

    buttonDiv.innerHTML = "<button>I Give Up :(</button>";
    buttonDiv.onclick = () => {
        endRound()
    }
}

const reviewScoreStep = (state, nextGameStep) => {
    setInstruction('Your score is:');

    const {score, gameSize} = state;

    const perfect = (score === gameSize);

    gameDiv.innerHTML = `
        <div id="final-score" class="${perfect ? 'perfect': ''}">
            ${score}/${gameSize}
        </div>
        <h1>${perfect ? 'Perfect Score! Beer\'s on me.' : 'Nice Try!'}</h1>
    `;

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