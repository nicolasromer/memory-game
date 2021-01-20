const http = require('http');
const fs = require('fs');
const path = require('path');

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

http.createServer(function (request, response) {
    console.log('request ', request.url);

    let filePath = '.' + request.url;
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

}).listen(5858);

onSuccess();
