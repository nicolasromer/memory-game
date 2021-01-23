import Card, {getHtml} from "../elements/Card.js";

class CardSet {
    /* Private */
    container;

    constructor(cardContainer) {
        this.container = cardContainer;
    }

    getCards() {
        return Array.from(document.getElementsByClassName('card'))
            .map(card => new Card(card));
    }

    flipDownCards() {
        this.getCards().forEach((card, index) => {
            setTimeout(() => card.flipDown(), index * 50);
        });
    }

    insertCards(numbers) {
        this.container.innerHTML = numbers.map(number => getHtml(number)).join('');
    };

    removeCards() {
        this.getCards().forEach(card => card.remove());
    }

    toNumberArray() {
        return this.getCards().map(card => card.getNumber())
    }

    activateCardsForPlay(handleComplete, handleCorrectClick) {
        // Mutation alert
        let cardsRemaining = this.toNumberArray();
        const isLowest = number => number === Math.min(...cardsRemaining);
        const remove = number => cardsRemaining.splice(cardsRemaining.indexOf(number), 1);

        const cards = this.getCards();

        cards.forEach((card /* : Card */, index) => {
            card.$node.addEventListener("click", e => {
                const number = card.getNumber();

                if (isLowest(number)) {
                    card.flipUp();
                    remove(number);
                    handleCorrectClick()
                }

                if (cardsRemaining.length === 0) {
                    handleComplete()
                }
            })
        });
    }

    showScore(score, possibleScore) {
        const perfect = (score === possibleScore);

        this.container.innerHTML = `
            <div id="final-score" class="${perfect ? 'perfect': ''}">
                ${score}/${possibleScore}
            </div>
            <h1>${perfect ? 'Perfect Score! Beer\'s on me.' : 'Nice Try!'}</h1>
        `;
    }
}

export default CardSet;