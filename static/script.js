console.log('script loaded');

// static configuration
const gameSizes = [4,8,12];
const cardHeight = 200;

// dom references
const instructionDiv = document.getElementById('instruction');
const gameDiv = document.getElementById('game');
const buttonDiv = document.getElementById('button');

// TODO: Card class with all these functions
const getCardHtml = (number) => (
    // ToDo: make accessible with keyboard
    `<div
        class="card"
        data-number="${number}"
    >
        ${number}
    </div>`
);

const getCards = () => Array.from(document.getElementsByClassName('card'));

const getCardNumber = (card) => parseInt(card.dataset.number, 10);

const insertCards = (numbers) => {
    gameDiv.innerHTML = numbers.map(number => getCardHtml(number)).join('');
};

const hideCard = card => {
    card.style.height = '10px';
    card.style.color = 'rgb(0, 0, 0, 0)';
    setTimeout(() => card.remove(), 200);
}

const hideCards = () => getCards().forEach(card => hideCard(card));

const flipDown = (card) => {
    card.style.height = '0px';
    card.style.color = 'rgb(0, 0, 0, 0)';
    setTimeout(()=>{
        card.style.height = cardHeight +'px';
    }, 200);
}

const flipUp = (card) => {
    card.style.height = '0px';
    card.style.color = 'black';
    setTimeout(()=>{
        card.style.height = cardHeight +'px';
    }, 200);
}

const setInstruction = instruction => {
    instructionDiv.innerHTML = `<p>${instruction}</p>`;
}

// game steps
const showGameSizeChoice = (state, nextGameStep) => {
    setInstruction('How many cards can you remember?');
    insertCards(gameSizes);

    const cards = getCards();
    cards.forEach(el => el.addEventListener("click", e => {
        const number = getCardNumber(e.target);
        cards.forEach(hideCard);
        const newState = {...state, gameSize: number};
        nextGameStep(newState);
    }));
}

const memorizeCards = async (state, nextGameStep) => {
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

const isLowest = (number, set) => number === Math.min(...set);
const remove = (number, set) => set.splice(set.indexOf(number), 1)

const guessingPhase = (state, nextGameStep) => {
    setInstruction('Now, click the cards in order, from lowest to highest.');

    let hiddenCards = [...state.cardNumbers];

    let score = 0

    const endRound = () => {
        hideCards();
        nextGameStep({...state, score});
    }

    getCards().forEach((card, index) => {
        // rolling thunder
        setTimeout(flipDown(card), index * 50);

        card.addEventListener("click", e => {
            const number = getCardNumber(card);
            if (isLowest(number, hiddenCards)) {
                flipUp(card);
                // fixme: mutation
                remove(number, hiddenCards);
                score += 1;
            }

            if (!hiddenCards.length) {
                endRound()
            }
        })
    });

    buttonDiv.innerHTML = "<button>I Give Up :(</button>";
    buttonDiv.onclick = () => {
        endRound()
    }
}

const scoringPhase = (state, nextGameStep) => {
    setInstruction('Your score is:');

    const {score, gameSize} = state;

    const perfect = score === gameSize;

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
    showGameSizeChoice({},
        (state2) => memorizeCards(state2,
            (state3)=> guessingPhase(state3,
                (state4) => scoringPhase(state4,
                        startGame
                    )
                )
        )
    );
}


window.onload = startGame;