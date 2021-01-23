// imports are relative to "/static" since they're coming from the server
import Game from '../elements/Game.js';

const gameDiv = document.getElementById('game');
const game = new Game(gameDiv);

window.onload = () => game.startNew();

