
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
    
NATS streaming server
    - NATS - event sharing only
    - NATS streaming = NATS + extra
        - https://docs.nats.io/nats-streaming-concepts/intro

    - node nats streaming NPM lib (not express/axios as our custom event bus project)
        - https://github.com/nats-io/stan.js

        - Event style of library usage and callback style.
        - 
    - channels/topics = subject = name of the channel.
        - ticket:update channel/topic
        - ticket:created channel/topic
        - order:created channel/topic
        - order:update channel/topic

        - we publish to a channel and get events by subscribing to a channel.

    - Replay events
        - new service can get all events.
        - a service crashes and comes up again.
        - or the nats streaming server crashes.

        - stores all events in memory by default. Can be configured to files or DB mysql/postgres.

Connect into a cluster
    - option1
        - ingress update
    - option2
        - node port
    - option3
        - dev ENV only: setup cluster to portforward
            - k port-forward nats-depl-778bdd877c-m2jd6 4222:4222
        - easy to kill it (Ctrl-C)


Nats events
    - message = event

Nats Message
    - getSequence()
        - starts with 1 and increments
    - getData()
        - get the data json string.

Scaling
    - vertically
        - more cpu, ram etc
    - horizontally
        - more instances.

NATS and many service replicas
    - we want the event to be handled by only ONE service instance.
        - QUEUE GROUPS!
    - Nats server will only send the event to one of the group members.
    - Another service might listen to the event as well and will receive it as well.
    - Default behavior is that an event that is received, is marked as done.
        - This means that events can get lost if there is a bug or connection error for example.
        - WE WANT TO CHANGE THIS TO BE ABLE TO REPROCESS IT.
        - stan.subscriptionOptions().setManualAckMode(true); <------------------------
            - it's not automatically ack.
            - if we not, 30 s wait by NATS, then send it to some other member of a queue group (
                or send event if not queue group)
            - Same sequence number.

NATS health
    - http://localhost:8222/streaming
    - http://localhost:8222/streaming/clientsz
        {
            "cluster_id": "ticketing",
            "server_id": "5XFv6xNXWESge9WyorVlZA",
            "now": "2020-10-25T17:57:06.958064Z",
            "offset": 0,
            "limit": 1024,
            "count": 3,
            "total": 3,
            "clients": [
                {
                    "id": "249f0e67",
                    "hb_inbox": "_INBOX.ZR2PSXE8RRX8J0BWD3U1VM"
                },
                {
                    "id": "7de8ddc8",
                    "hb_inbox": "_INBOX.B44JPEN8VW09V4SG0Q9DUZ"
                },
                {
                    "id": "abc",
                    "hb_inbox": "_INBOX.8EZKBX52TLIQ4XXQU2EFNG"
                }
            ]
        }
    - http://localhost:8222/streaming/channelsz?subs=1

    - If one service in a group dies, the nats server will wait for 30 s for it to come back
    - But if it was a restart, we now have N+1 subscriptions in the nats server.
    - After 30 s the nats server gives up and removes the old subscription.
    - Therefore an event might come out of order, because nats server is waiting to send it until 
    - the service comes online.
        - what do do?
            - heart beat
                - hbi - how often
                - hbt - how long time client has to responds
                - hbf - how many times nats tries.
            - service SIGINT/SIGTERM -> stan.close()
                - not 100%.

Event order
    - While an event is waiting to be sent out due to some service being down
      other events are sent. Out of order!!!!???

Event concurrency
    - these are core issues
        - really challenging to solve
        - can't solve by using another event bus
        - 
    - bank application
        - event withdraw, event deposit
        - requirement: amount must be > 0
        - A +70 -> 70
        - B +40 -> 110
        - C -100 -> 10

        - Many ways above can fail
        - A +70 -> fail due to some reason. We do not ack the event, takes 30s for NATS to do this.
        - B +40 -> 40
        - C -100 -> not allowed.

        - Servers are processing differently speeds.
        - A +70 -> overloaded machine XX ...
        - B +40 -> overloaded machine XX ...
        - C -100 -> fast machine YY, out of money.

        - A client is down, but within a heartbeat period (NATS thinks it's alive) 
        - A +70 -> dead machine XX ...
        - B +40 -> dead machine XX ...
        - C -100 -> fast machine YY, out of money.
       
        - A +70 tuesday
        - B +40 wednesday
        - C -100 friday, but laggy file IO, takes 29.9999 sec, 10 left on account
            - but now NATS server sends the event to another
            - -100, not allowed since we only have 10.  

    - async sucks? go sync?
        - happens with sync as well
        - happens with monolith as well.

        - Load balancer -> 3 instances -> db
        - same problem!!!!
        - just "seem" bigger with async....

    - solution #1
        - use just one account service instance
        - same problem with events out of order with one instance.
    - solution #2
        - try to solve each problem by code
    - solution #3
        - share state between services (redis, db, whatever)
            - one time processing, in order
            - other events are held up if unrelated to previous event.
            - only one update at a time....sloooow.
        - record seq numbers
        - the service checks that the previous seq number has been processed before
          continue.
    - solution #4
        - same as above but we track users
            - one resource/request does not affect others (own sequence pools)
                - need a channel reserved for jim and mary
                - max 1000 channels by default, more processing overhead.
                - Any event bus will have problem to manage this.
    - solution #5
        - publisher sends event to NATS, and gets back sequence number (but this is not possible)
        - it stores this the seq number and event and last seq number.
        - NATS sends the event o listener
        - listener stores the "last" processed sequence number.

Solving concurrency
    - We can't solve it by using NATS
    - We need to revisit the service design
    - Redesign the system, a better solution to concurrency stuff will present itself

    - General
        - Request to modify resource xyz
        - goes to service that owns xyz
        - sends event describing change to xyz to NATS
        - all other services listen to the event
    
    - Publisher 
        - transaction service
            - stores all transaction in DB for user
            - emit events that transaction is created (transaction:created { deposit: 70, id, userID, transactionNumber: 1})
        - account service
            - listen to 'transaction:create'
                - balance and last txn number is stored
                - "does not process if tnx number is wrong"
        - having tnx number we solved
            - nats thinks client is alive even if it's dead
            - one listener runs more quickly than another
            - one listener fails and we have to wait 30 sek before event is reissued.
            - different users commit at the same time, since txn number if per user/resource/transaction.
            - 

Ticket service
    - create ticket {id: czq, price: 10, v: 1}
    - A ticket:create {id: czq, price: 10, v: 1}
    - update ticket {id: czq, price: 50, v: 2}
    - B ticket:update {id: czq, price: 50, v: 2}
    - update ticket {id: czq, price: 100, v: 3}
    - C ticket:update {id: czq, price: 100, v: 3}

Nats
    - 
Order service (2 instances)
    - A event fails
    - B update event (a does not exist) - timeout
    - A event ok (v=1)
    - B(v2) and C(v3) in parallel
        - B fails
        - C will not process since v=1
        - B ok (v2)
        - C ok (v3)

    >>>>>>>>>>>>>>>>>>> VERSION NUMBER <<<<<<<<<<<<<<<<<<

    The owning service increments it.
    The other services is storing it, but always "lagging" behind.

Event redelivery
    - setDeliverAllAvailable
        - everything is replayed
            - not feasible
    - Durable subscription (need setDeliverAllAvailable!!)
        - NATS record and stores if the event AND IF it has been successfully processed or NOT.
        - BUT Nats will dump the durable subscription history if the service disconnects!!!
            - solve it by queue groups
            - 

-----------------------------------------------------------------------------------
            const options = stan
            .subscriptionOptions()
            .setManualAckMode(true)
            .setDeliverAllAvailable() <----------------- to get all event in the past. Makes sure that if a new service comes up, it must get all events.
            .setDurableName('order-service'); <----------------- nats stores events status processed/or not. Good to make sure we don't miss out on events + never re-process events.

            const subscription = stan
            .subscribe('ticket:created', 'orders-service-queue-group', options); <----------------- queue group to make sure nats doesn't dump the durableEvents

-----------------------------------------------------------------------------------


Typescript
    - Enums!
    - // This property might be undefined for a while.
      private _client?: Stan;
    
Test
    - not so much to test publishers....they are just requests....
    - listeners will be in focus

Code structure and typos
    - put definition of events and event names/subject in COMMON
    - (not enough to have these in the services only - to big risk of typos)
    - Without doing this, we must continually during development crosscheck every subject, and field in a event.
    - Alternatives to using typescript as schema validation
        - 1) JSON schema (not as good as TS)
        - 2) Protobuf (not as good as TS)
        - 3) Apache Avro
    
NATS server restart
    - in memory, just restart it
    - k delete pod <>
        - the deployment will start a new one

Mongo/mongoose
    - Two ways to associate
        - Embed
            - downsides
                - querying if a ticket is "in use" requires us to go through 
                  all orders and check the embedded ticket object.
                - Inside the order service, there must be tickets that are not 
                  associated with an order, that are just there since they have 
                  been created.
        - Ref/population
            - Order collection + ticket collection
                - 


Events out of order
    - issue when updating events are out of order
        - solve by having a version number
        - https://github.com/eoin-obrien/mongoose-update-if-current

    - --------------------> Only the primary service is allowed to increment the version number <-------------------------

    - Its the ticket service that is producing the version numbers, and the order service consuming them.

    - versioning solves the events out of order problem by bouncing back the event to Nats and processing it later.

    - drawback
        - requires all microservices to use this mongo npm package!!

    - own
        - https://mongoosejs.com/docs/api/model.html#model_Model-$where
        - here: orders/src/models/ticket.ts


Exec mongo
    k exec -it orders-mongo-depl-67bd4b4d48-mc7fg mongo

    show dbs
    use orders
    db.tickets
    db.tickets.find({})

Typescripts
    - private/protected
        - like react context
    - optional values work better with undefined than with null

#309/#310 Loosing NATS Connection
    - data duplication mismatch
    - use db transaction + store event in db + separate process that sends events to nats
    - 

Expiration service
    - setTimeout
        - if the server restarts, we loose all timers
    - rely on NATS
        - not ack, nats redeliver it in 5 seconds.
        - tracking fails is checking redeliver - this solution will spam this.
            - will alert engineers
    - There are other event buses that support publishing with 15 minutes delay (not NATS). Scheduled event.
        - the order service would just send it self to remind it self.
    - https://github.com/OptimalBits/bull

StripeJS
    - not need to handle credit card numbers
    - steps
        - Credit card number is sent to stripe API
        - We get back token (authorization to charge credit card). It's a one time use token to charge for money.
        - Our javascript can submit the token to our payment service.
        - Out payment service is then using the token to charge the credit card along with an API key

    Secret
        - kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<the secret>

    Charge  
        - by smallest currency amount

    Test token while stripe account is in test mode
        -
        {
            "orderId": "5f9ee2bfc379a9001854a1b9",
            "token": "tok_visa"
        }

Stripe
    - https://stripe.com/docs/testing


Ci/CD
    - mono vs separate repos
        - mono git repo is preferred
    
    - https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows

    - when having paths in the github action files, all services that have been changed will run, not just the last commits change.

    - Providers
        - Google
            - 113$/month
            - easy
            - good monitoring
        - Azure
            - 72$/month
            - easy
            - not used
        - AWS
            - expensive 126/month
            - huge amount of options
            - huge amount of steps
            - huge amount of screens, ui, 
            - all extremely mysterious
            - documentation is poor
            - don't understand what fargate is and how it's related to kubernetes.
            - very bad decision if starting with kubernetes.
        - Digital ocean 
            - cheapest 40/month
            - very easy to use.
        

Digital ocean
    - brew install doctl
    - create a token 
        - https://cloud.digitalocean.com/account/api/tokens?i=f5a469
    - use token to init doctl
        - https://github.com/digitalocean/doctl#authenticating-with-digitalocean
            - run: doctl auth init
            - then paste in the token 
    - Create a context
        - doctl kubernetes cluster kubeconfig save ticketing
            > Notice: Adding cluster credentials to kubeconfig file found in "/Users/peterlarsson/.kube/config"
            > Notice: Setting current-context to do-fra1-ticketing
        - the above have set the context to point into DO cluster.
    
    - list all context
        - k config view
    - delete a context
        -  k config delete-context do-fra1-ticketing

    - change context
        - k config use-context docker-desktop

    - secrets
        - kubectl create secret generic jwt-secret --from-literal=JWT_KEY=348f84jF9dfFfh7
        - kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<the secret>

    - ingress
        - kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.41.0/deploy/static/provider/do/deploy.yaml
            > namespace/ingress-nginx created
            > serviceaccount/ingress-nginx created
            > configmap/ingress-nginx-controller created
            > clusterrole.rbac.authorization.k8s.io/ingress-nginx created
            > clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx created
            > role.rbac.authorization.k8s.io/ingress-nginx created
            > rolebinding.rbac.authorization.k8s.io/ingress-nginx created
            > service/ingress-nginx-controller-admission created
            > service/ingress-nginx-controller created
            > deployment.apps/ingress-nginx-controller created
            > validatingwebhookconfiguration.admissionregistration.k8s.io/ingress-nginx-admission created
            > serviceaccount/ingress-nginx-admission created
            > clusterrole.rbac.authorization.k8s.io/ingress-nginx-admission created
            > clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
            > role.rbac.authorization.k8s.io/ingress-nginx-admission created
            > rolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
            > job.batch/ingress-nginx-admission-create created
            > job.batch/ingress-nginx-admission-patch created


Github
    - create workflow
        - builds image, docker login, docker push
            - uses github secret for username and password
    

    - Github container
        - install doctl
        - authorize it with the DO key
        - use doctl to feed the context into kubectl so that we can communicate with DO 
        - kubectl comes preinstalled
    - create a github flow to update image of auth (deploy-auth.yaml)
    - create a github flow to apply all k8s yaml files (deploy-manifest-yaml)
    - 


DO
    - A load balancer was created for us when we ran the nginx ingress apply command
    - The load balancer has an IP 
    - Need to point our domain to it
    

Tear down
    - Destroy the load balancer
    - Destroy the cluster


Next steps
    - cert-manager.io
    - mail service - mailchimp/sendgrid
        - listen for events - payed for example.
    - add build step for production mode
        - Dockerfile.prod
    -stage cluster
        - another domain
        - only accessible by team members
        - 

Ingress
    - Ingress Resource
         - Defines the rules for routing
    - Ingress Controller
        - Implements the above rules
    - Popular choices
        - nginx, contour, haproxy, traefik
        - 
    - The ingress controller creates a load balancer that provisions Digital Ocean load balancer.

    - Begin with: creating the Nginx Ingress Controller Kubernetes resources
        - kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.34.1/deploy/static/provider/do/deploy.yaml
        - Will create ConfigMaps containing the controllers configuration, RBCA roles, + Ingress controller deployment
        - Will create a Digital Ocean load balancer that can receive external traffic.

    - Next step is to write the ingress-srv.yaml file
        - Create routing rules + enable internal pod communication through the load balancer.

SSL
    - Certificates can be automatically requested and configured by annotating Ingress Resources (in ingress-srv.yaml), appending a tls section to the Ingress spec, and configuring one or more Issuers or ClusterIssuers to specify your preferred certificate authority. 

    - there are staging and prod certs
        - difference 
            https://community.letsencrypt.org/t/using-lets-encrypt-staging-certificates-on-internal-testing-staging-development-environments/7981/7


    - install cert manager (prod)

    kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.16.1/cert-manager.yaml
        customresourcedefinition.apiextensions.k8s.io/certificaterequests.cert-manager.io created
        customresourcedefinition.apiextensions.k8s.io/certificates.cert-manager.io created
        customresourcedefinition.apiextensions.k8s.io/challenges.acme.cert-manager.io created
        customresourcedefinition.apiextensions.k8s.io/clusterissuers.cert-manager.io created
        customresourcedefinition.apiextensions.k8s.io/issuers.cert-manager.io created
        customresourcedefinition.apiextensions.k8s.io/orders.acme.cert-manager.io created
        namespace/cert-manager created
        serviceaccount/cert-manager-cainjector created
        serviceaccount/cert-manager created
        serviceaccount/cert-manager-webhook created
        clusterrole.rbac.authorization.k8s.io/cert-manager-cainjector created
        clusterrole.rbac.authorization.k8s.io/cert-manager-controller-issuers created
        clusterrole.rbac.authorization.k8s.io/cert-manager-controller-clusterissuers created
        clusterrole.rbac.authorization.k8s.io/cert-manager-controller-certificates created
        clusterrole.rbac.authorization.k8s.io/cert-manager-controller-orders created
        clusterrole.rbac.authorization.k8s.io/cert-manager-controller-challenges created
        clusterrole.rbac.authorization.k8s.io/cert-manager-controller-ingress-shim created
        clusterrole.rbac.authorization.k8s.io/cert-manager-view created
        clusterrole.rbac.authorization.k8s.io/cert-manager-edit created
        clusterrolebinding.rbac.authorization.k8s.io/cert-manager-cainjector created
        clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-issuers created
        clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-clusterissuers created
        clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-certificates created
        clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-orders created
        clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-challenges created
        clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-ingress-shim created
        role.rbac.authorization.k8s.io/cert-manager-cainjector:leaderelection created
        role.rbac.authorization.k8s.io/cert-manager:leaderelection created
        role.rbac.authorization.k8s.io/cert-manager-webhook:dynamic-serving created
        rolebinding.rbac.authorization.k8s.io/cert-manager-cainjector:leaderelection created
        rolebinding.rbac.authorization.k8s.io/cert-manager:leaderelection created
        rolebinding.rbac.authorization.k8s.io/cert-manager-webhook:dynamic-serving created
        service/cert-manager created
        service/cert-manager-webhook created
        deployment.apps/cert-manager-cainjector created
        deployment.apps/cert-manager created
        deployment.apps/cert-manager-webhook created
        mutatingwebhookconfiguration.admissionregistration.k8s.io/cert-manager-webhook created
        validatingwebhookconfiguration.admissionregistration.k8s.io/cert-manager-webhook created

    kubectl get pods --namespace cert-manager
        NAME                                      READY   STATUS    RESTARTS   AGE
        cert-manager-cainjector-fc6c787db-vztzg   1/1     Running   0          66s
        cert-manager-d994d94d7-g8dsd              1/1     Running   0          66s
        cert-manager-webhook-845d9df8bf-qnhtm     1/1     Running   0          66s

    - Issuing certificate
    -  A ClusterIssuer is not namespace-scoped and can be used by Certificate resources in any namespace.


    - Roll out the issuer (on prod)
       - kubectl create -f infra/k8s-prod/prod-issuer.yaml 
         >clusterissuer.cert-manager.io/letsencrypt-prod created
    
    - get the cert (we added tls section in ingress.srv.yaml)
    - kubectl apply -f infra/k8s-prod/ingress-srv.yaml 
      > ingress.networking.k8s.io/ingress-srv configured
      > service/ingress-nginx-controller unchanged



Storage
    You already have a PersistentVolume along with the corresponding storage medium provisioned and want to use that (without referring to a custom Storage Class or the default one)
    In this case, just set storageClass to an empty string ("") in the PersistentVolumeClaim. This will suppress dynamic provisioning!

    If storageClassName is set to an empty string (‘’) in the PVC, no storage class will be used (i.e.; dynamic provisioning is disabled for this PVC)


    ReadWriteOnce -- the volume can be mounted as read-write by a single node
    ReadOnlyMany -- the volume can be mounted read-only by many nodes
    ReadWriteMany -- the volume can be mounted as read-write by many nodes


Forward port from local machine into cluster mongo depl

k port-forward tickets-mongo-depl-7bdd7998d9-gggbz 27017:27017

cat drop_postgres.db.sql | psql -h 127.0.0.1 nats_streaming 1

NOTICE:  table "serverinfo" does not exist, skipping
DROP TABLE
NOTICE:  table "clients" does not exist, skipping
DROP TABLE
NOTICE:  table "channels" does not exist, skipping
DROP TABLE
NOTICE:  index "idx_channelsname" does not exist, skipping
DROP INDEX
NOTICE:  table "messages" does not exist, skipping
DROP TABLE
NOTICE:  index "idx_msgstimestamp" does not exist, skipping
DROP INDEX
NOTICE:  table "subscriptions" does not exist, skipping
DROP TABLE
NOTICE:  table "subspending" does not exist, skipping
DROP TABLE
NOTICE:  index "idx_subspendingseq" does not exist, skipping
DROP INDEX
NOTICE:  table "storelock" does not exist, skipping
DROP TABLE


cat postgres.db.sql | psql -h 127.0.0.1 nats_streaming 1 
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX
CREATE TABLE
CREATE INDEX
CREATE TABLE
CREATE TABLE
CREATE INDEX
CREATE TABLE
ALTER TABLE
