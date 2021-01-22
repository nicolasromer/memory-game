
const cardHeight = 200;

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

export default Card;