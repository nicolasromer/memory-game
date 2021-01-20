console.log('script loaded');

// static configuration
const gameSizes = [4,8,12];

// dom references
const instructionDiv = document.getElementById('instruction');
const gameDiv = document.getElementById('game');

// dom helpers
const getCardHtml = (number, handleClick) => `<div class="card" data-number="${number}">${number}</div>`;
const setInstruction = instruction => {
    instructionDiv.innerHTML = `<p>${instruction}</p>`;
}

// state
let state =  {
    gameSize: null,
};

const resetState = () => {state = {}};

// game steps
const showGameSizeChoice = () => {
    setInstruction('How many cards can you remember?');

    gameDiv.innerHTML = gameSizes.map(size => getCardHtml(size)).join('');

    const cards = Array.from(document.getElementsByClassName('card'));

    cards.forEach(el => el.addEventListener("click", e => {
        const number = () => parseInt(e.target.dataset.number, 10);
        state.gameSize = number;
        cards.forEach(c => c.remove())
    }));
}

const startGame = () => {
    resetState()
    showGameSizeChoice();


}


window.onload = startGame;