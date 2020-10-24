
NEXT PROJECT - STUBHUB CLONE
    - We want to make sure that user doesn't click pay and enters credit-card
      information to a ticket that's already been sold.
    - We will focus on ticketing aspect.
    - lock ticket for 15 min.
    - handle price raise at the same time as purchase.

    Overview
        DB
            - MongoDb
            - User
            - Ticket (+ref User, +ref Order)
            - Order (+ref User, +ref Ticket)
            - Charge (+ref Order)

        Services
            - auth
                - sign up, sign in, sign out
            - tickets
                - Ticket create/edit.
            - orders
                - Order creation/editing
            - expiration
                - watches for orders to be created, cancels them after 15 min
            - payments
                - cancel orders if payment fails, complete if payment succeeds

            - Not a rule that there is one to one mapping between resource and service  
                - this is a course...to learn how to solve async microservice problems.
        
        Events
            - NATS streaming server (even bus)
            - UserCreate, UserUpdated
            - OrderCreated, OrderCancelled, ...

        Client
            - NextJS SSR react framework.

        Expiration service  
            - Redis
        
        Common
            - npm library

Error handling
    1. Have consistent structure from all servers
        - error handling middleware
    2. All kind of errors must be handled.
        - catch all errors and pass onto express

Express error handling
    - Scenario 1: sync route handler - just throw and express catches it.
    - Scenario 2: async route handler - we catch and call next().
        - applies for callback, promise, async/await.
    
    - a function with 4 args is an error handling
    
    Abstract class
        - Cannot be instantiated
        - Use to setup requirement on subclasses
        - Does create a class in JS which we can use it in 'instanceof'

    - last middleware catches and responds with 404.

CustomError
    - Typescript will guide you on what the requirements are
    - statusCode of number
    - serializeErrors returning array of { message: string; field?: string }

Mongoose
    - when import mongoose first time in VSCode, it suggested to include mongoose types.
    - Does not work so well with typescript
    - Mongoose user model - represents the entire collection of users
    - Mongoose user document -represents one singe user
        - typescript does not know the structure of mongoose document creations.
        - we will teach TS about the structure.

Microservices with auth
    - User auth with microservices in an UNSOLVED problem.
        - not a perfect solution to handle this.
        - not use cookie, jwt...
    - There are many, none is perfect.
    
    - Fundamental option #1
        - Request -> Order service -> (sync request) -> Auth service (checks jwt/cookie)
    
    - Fundamental option #1.1
        - Request -> Auth service gateway (checks jwt/cookie) -> Order service
    
    - Fundamental option #2
        - each service can decide if authenticated
        - no dependency on other services
        - shared by npm module
        - critical downside: recall jwt/cookie.
            - a request is made to Auth service to ban the user.
            - the Auth service updates the user database that he is banned.
        - Request -> Order service (checks jwt/cookie)
            - we do not check with the Auth service!
    
    - Solving option #2 security issue
        - A lot of work!
        - jwt only valid for a set of time
        - (still an amount of time of dangerous access in this solution)
        - #1 
            - Request -> Order service (check and reach out if to old) -> Auth service (get new token)
        - #2
            - Request -> Order service (check and reject)

    
    - Solving option #2 security issue <-----------------------------
        - Auth service sends UserBanned event
        - All services persist it in short lived memory cache (same as jwt token valid time)
        - 

    - Requirements (jwt for the win)
        - Must be able to tell details about user (id, email)
        - Above must not be stored somewhere else
        - Must be able to handle authorization info
        - Must be tamper-resistant validity
        - Must be understood by different languages

    - Transport?
        - SSR
            - SEO
            - page loads time
            - the backend server needs to reach out to Orders service or what else
            - means that the browser MUST include the jwt on first request.
                - we cannot customize the first request in any way
                - WE MUST USE COOKIE AS TRANSPORT WHEN USING SSR

KUBERNETES
    - Secrets
        - Exposed as env variables inside the containers.
        - kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
            - generic - all purpose information
            - jwt-secret - the name of the secret
            - 
        - k get secret

TYPESCRIPT
    - process.env.MY_KEY!
        - Exclamation mark tells TS that we are sure it's defined.

    Add property to existing interface
        declare global {
            namespace Express {
                interface Request {
                currentUser?: UserPayload;
                }
            }
        }
    - ts-node-dev --poll src/index.ts
        We added --poll to prevent problems with file change detection in typescript ts-node-dev

DOCKER
    - RUN npm install --only=prod
        - makes sure that we do not install dev deps even if NODE_ENV is not production

TEST
    - Single piece of code (unit test)
        - example: single middleware
        - Test goal #2: unit test a model.
    - Pieces are working together
        - example: multiple middlewares of to and including a route handler.
    - Different components work together.
        - example: how auth service interacts with mongoDB or event bus.
        - Test goal #1: Basic request handling
            - Make a request and check response and assert database.
        - Test goal #3: Event emitting + receiving 
    - Different services work together.
        - example: Order & Ticketing service works together.
        - not focus, but test goal #3 simulates this.

    We run them locally

    We use mongo in-memory copy
        - Why not a single instance of a test mongo db?
            - Because we have multiple services that concurrently accessing
              mongodb.
            - It will run much quickly using memory variant.

    We use supertest library to fake requests to our express app
        - uses reference to the express app.
        - problem when testing multiple services at the same time
          that they all listen to 3000 for example.
        - 

    Jest
        - jest --watchAll --no-cache
            - watch all files and re-run test when change
            - no-cache is for typescript support to make jest detect file change

Client
    - we added, but not activated file change fix with polling in next.config.js


Namespaces
    - to organize different object
    - to reach another object in same namespace
        - http://auth-srv/api/bla bla
    - to reach another object in another namespace (cross namespace communication)
        - k get services -n ingress-nginx

        NAME                                 TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)                      AGE
        ingress-nginx-controller             LoadBalancer   10.104.32.48   localhost     80:30794/TCP,443:31225/TCP   2d5h
        ingress-nginx-controller-admission   ClusterIP      10.101.6.9     <none>        443/TCP                      2d5h

        - http://<name of service>.<name space>.svc.cluster.local
        - http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
    
    - OR create an External Nameservice to do the mapping.

    NPM
        - we write TS
        - before publish we transpile to JS
        - publish JS

        - npm login
        - npm publish --access public 
        - "main": "./build/index.js",
            - which file to import
        - "types": "./build/index.d.ts",
            - for typescript
        - "files": ["build/**/*"]
            - which files to publish
        
        - npm version patch
            - bumps version

        Option1
            - import { BadRequestError} from "@thelarsson/common/errors/bad-request.error.ts"
        Option2
            - import { BadRequestError} from "@thelarsson/common"

        - after services after a common push
            - npm update @thelarsson/common


Adding a new service
    - package.json
    - docker file
    - index.ts
    - build, push image
    - k8s deployment file
    - update skaffold.yaml
    - k8s mongo deployment file

SKAFFOLD
    - Changing env variables seems buggy. better to restart skaffold.
    