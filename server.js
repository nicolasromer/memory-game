const http = require('http');
const fs = require('fs');
const path = require('path');

// todo: this is the default debug port in xdebug, probably should be something else
// ticket: investigate port and document how to set up xdebug with dev setup
const port = 5858;

const cardsPathRegex = /^\.\/cards\/(\d{1,2})$/;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
};

const onSuccess = () => {
    const url = 'http://127.0.0.1:5858/';
    console.log('Server running at ' + url);
    const childProc = require('child_process');
    childProc.exec(`open -a "Google Chrome" ${url}`);
}

/**
 * get 'count' number of random numbers
 * with no duplicates
 * all below 100
  */
const getCards = (count /* : number */) /* : Array<number> */ => {
    const getRandomBelow100 = () => Math.floor(Math.random() * Math.floor(100))

    const emptyArrayOfCorrectLength = [...new Array(count)];

    const cards = emptyArrayOfCorrectLength.reduce(function addNewNumber(accumulator) {
        const number = getRandomBelow100();

        if (accumulator.includes(number)) {
            // recurse until we generate a number new to the array
            return addNewNumber(accumulator);
        }

        return [...accumulator, number];
    }, []);

    return cards;
}

http.createServer(function (request, response) {
    console.log('request ', request.url);

    let filePath = '.' + request.url;

    // TODO: improve routing. This will become unwieldy very quickly if we add any more routes.
    // Ticket: figure out how to do routing correctly and refactor createServer block

    // Get Cards
    if (cardsPathRegex.test(filePath)) {
        const count = cardsPathRegex.exec(filePath)[1];
        const cards = getCards(parseInt(count, 10));
        const content = JSON.stringify(cards);
        response.writeHead(200, {'Content-Type': 'text/json'});
        response.end(content, 'utf-8');
    }

    // Serve Static Files
    if (filePath === './') {
        filePath = './static/index.html';
    }

    const extension = String(path.extname(filePath)).toLowerCase();

    const contentType = mimeTypes[extension] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (!error) {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');

            return;
        }

        if(error.code === 'ENOENT') {
            fs.readFile('./404.html', function(error, content) {
                response.writeHead(404, { 'Content-Type': 'text/html' });
                response.end(content, 'utf-8');
            });
        } else {
            response.writeHead(500);
            response.end('Check your computer for smoke or fire: '+error.code+' ..\n');
        }
    });

}).listen(port, 'localhost', error => {
    if (!error) onSuccess();
});


