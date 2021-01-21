const fetch = require("node-fetch");

const baseUrl = 'http://localhost:5858';

const testCases = [4, 8, 12, 40];

const testGetCards = async (tests) => {
    tests.map(async (testValue) => {
        const expected = testValue;
        const testUrl = `/cards/${expected}`

        const response = await fetch(`${baseUrl}${testUrl}`);
        const cards /*: Array<number> */ = await response.json();
        const actualLength = cards.length;

        // Are arrays the same length as requested?
        actualLength === expected
            ? console.log(`PASS: ${testUrl} returns correct number of cards`)
            : console.log(`FAIL: ${testUrl} returned ${actualLength}, expected ${expected}`)

        // Are all numbers unique?
        const deDupedCards = [...new Set(cards)];
        cards.length === deDupedCards.length
            ? console.log(`PASS: ${testUrl} returns All Unique Numbers`)
            : console.log(`FAIL: ${testUrl} returned some duplicate cards: ${cards}`)

        // Are all numbers below 100?
        const cardsAbove100 = cards.filter(card => card < 100);
        cardsAbove100.length > 0
            ? console.log(`PASS: ${testUrl} returns all numbers below 100`)
            : console.log(`FAIL: ${testUrl} returned some numbers above 99: ${cardsAbove100}`)
    });
}

testGetCards(testCases);

// todo: Ticket: create tests for static service

// todo: Ticket: create tests that API does not accept invalid URLs

// todo: Ticket: create tests that API throws 404 when static file not found