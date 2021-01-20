console.log('script loaded');

// static configuration
const gameSizes = [4,8,12];

// dom references
const instructionDiv = document.getElementById('instruction');
const gameDiv = document.getElementById('game');
const buttonDiv = document.getElementById('button');

// dom helpers
const getCardHtml = (number, handleClick) => `<div class="card" data-number="${number}">${number}</div>`;
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

const memorizeCards = (state, nextGameStep) => {
    setInstruction('Okay now, memorize these cards!');

    buttonDiv.innerHTML = "<button>I'm Ready</button>";
    buttonDiv.onclick = nextGameStep(state);

    const cardCount = state.gameSize;
    const getRandomBelow100 = () => Math.floor(Math.random() * Math.floor(100))
    const numbers = [...new Array(cardCount)].map(() => getRandomBelow100())
    insertCards(numbers);
}

const startGame = () => {
    showGameSizeChoice({},
        (state) => memorizeCards(state, ()=> {}),
    );



}


window.onload = startGame;