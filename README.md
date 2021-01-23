# memory-game

This is a memory game played with numbered cards. How many cards can you keep in your head?

Play if you dare!

## Approach and Technical Roadmap
- I decided to use no frameworks or packages here, just vanilla ES6 javascript for a few reasons.  I wanted to create my own server on Node.js rather than using express or fastify. I only rely on the `node-fetch` package for the tests.  I chose this setup for now to prioritize development speed, and I wanted to re-learn some JS and Node fundamentals.
-  I would have used some Typescript if I had more time to work on this, there are a couple places where I noted types and interfaces to implement later.
- I implemented CommonJS modules without webpack, I think this only works on Chrome.
- Today I learned about Generator functions. I used one for the game-step manager.
- I left many `TODO` and `Ticket` notations around. These are opportunities to properly answer some questions I had or delegate if I had some other devs. Normally I would create a ticket and leave the ticket number in the code if I ever left a TODO or FIXME.

There remains a lot of work on the front end:
- accessibility (keyboard access, aria attributes)
- improve animation
- test on other browsers, operating systems, and devices
- implement webpack to transpile js so all the bleeding edge language features work on IE and safari

Backend could also use lots of work:
- There is only one test set for the `/cards` endpoint. Needs more tests!
- improve server code to better split concerns (maybe just move to Express.js):
- routing is pretty sad right now
- consider security and rate limiting
    
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
*, I'm pretty sure chrome is required*
- clone the repo and `cd` into the root
- run `npm install`
- run `npm run start`

## Tests
- ensure server is running
- run `npm run test`
- test output will show up in your terminal