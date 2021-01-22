# memory-game

This is a memory game played with numbered cards. How many cards can you keep in your head?

Play if you dare!

## Approach and Technical Roadmap
I decided to use no frameworks or packages here, just vanilla ES6 javascript for a few reasons.  I wanted to create my own server on Node.js rather than using express or fastify. I would have used Typescript if I had more time to work on this, there are a couple places where I noted types and interfaces to implement later. I only rely on the `node-fetch` package for the tests. I implemented CommonJS modules without webpack, I think this only works on Chrome. I chose this setup for now to prioritize development speed, and I wanted to re-learn some JS and Node fundamentals. 

I left many `TODO` and `Ticket` notations around. These are opportunities to properly answer some questions I had or delegate if I had some other devs. Normally I would create a ticket and leave the ticket number in the code if I ever left a TODO or FIXME.

There remains a lot of work on the front end:
- accessibility (keyboard access, aria attributes)
- improve animation
- test on other browsers, operating systems, and devices

There is only one test set for the `/cards` endpoint. Needs more tests!

### Refactor Plan:
- learn more about generator functions, and can we use one for the central game orchestration?
- create an array of objects, with each object as a 'Phase' of the game, and an interface for phases:
```javascript
{
  name: "memorize",
  setup: "setUpMemorizeStep",
  cleanup: "cleanUpMemorizeStep",
  stateProperty: null // the property in the state this step would be allowed to set
}
```
- improve server code to better split concerns (maybe just move to Express.js):
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







## To Run server
*n.b: developed with node 10 and only tested on Chrome*
- clone the repo and `cd` into the root
- run `npm install`
- run `npm run start`

## Tests
- ensure server is running
- run `npm run test`
- test output will show up in your terminal