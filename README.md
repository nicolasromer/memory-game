# memory-game

This is a memory game played with numbered cards. How many cards can you keep in your head?

Play if you dare!

# Approach
I decided to use no frameworks or packages here, just vanilla ES6 javascript. I wanted to create my own server on Node.js rather than using express or fastify. I would have used Typescript if I had more time to work on this, there are a couple places where i noted types and interface to implement later. I only rely on node-fetch for the tests.

I left many TODO and 'Ticket' notations around. Some opportunities to properly answer some questions I had and delegate. Normally I would create a ticket and leave the ticket number in the code if I ever left a TODO or FIXME.

Since this is pretty trivial I have kept the code all in one file. If we keep adding stuff I would break it into many JS modules to separate layers of abstraction. 



###Refactor Plan:
- learn more about generator functions, and can we use one for the central game orchestration?
- create an array of objects, with each object as a 'Phase' of the game, and an interface for phases:
```json
{
  "name": memorize,
  "setup": setUpMemorizeStep,
  "cleanup": cleanUpMemorizeStep,
  "stateProperty": null, // the property in the state this step would be allowed to set
}
```
- create a `Card` class to house all the card helper functions and card state
- improve server code to better split concerns:
  - routing
  - error handling
  - security
    
### If my game goes viral and I need to serve millions of users and grow the company
- serve static assets from a cdn
- implement server-side caching for static assets
- deploy my code somewhere I can enable auto-scaling (e.g. heroku, AWS)
- switch to a more powerful server framework (express) so I can cover my blind spots security-wise, and onboard new devs more easily
- get a real test suite and automated test runner (jest, enzyme)
- create a pipeline for deployment that checks code, runs tests, etc and deploys to cloud environment
- enforce strict Typescript to reduce bugs as devs onboard







# To Run server
- developed with node 10
- only tested on Chrome
- clone the repo and `cd` into the root
- run `npm run server`

# Tests
- ensure server is running
- run `npm run test`
- test output will show up in your terminal