# memory-game

In this game, a player is presented with a number of cards. Each card has a number on one side and
is blank (empty) from the other side. To start the game, the player is asked to choose the number
of cards to play (4, 8 or 12). After that, they will see the cards on the screen with random numbers
displayed on them and one button “Play”.

When they click the play button, cards should be flipped to the blank side. The player is then asked
to click on the cards in ascending order of the numbers that are on the other side.

Example turn:
- Player chooses 4 cards.
- Cards are displayed with numbers: 34, 10, 12, 45.
- Cards are flipped to the blank side.
- Player click on the 10 cards followed by 12, 35, 45
- Player wins.

Bonus (optional)
- The player can see the history of turns ordered by date.

Technical Requirements
- The random numbers are chosen by the backend.
- Bonus (optional): code tests.

# To Run
developed with node 10
clone the repo and `cd` into the root
run `node server.js` 