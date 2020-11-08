# What this?

This repo contains the output from the Udemy course [Microservices with NodeJS and React](https://www.udemy.com/course/microservices-with-node-js-and-react) with some changes on the way.

+ Added TLS support on production cluster.
+ The NextJS client setup is more inline with 5-nov-2020 version of NextJS with static/hybrid/client ways of rendering pages.
+ Nats streaming server with postgres SQL storage (instead of in-memory). Using initContainer to wait for database connection before starting nats streaming server. The postgres pod is using local storage PVC locally and Digital Ocean block storage (do-block-storage) in production cluster.

# Get going on a clean kubernetes cluster

Make sure that you are using the right kubectl context, that is either local or digital ocean.

---
## Digital Ocean SSL

To fullfil that our ingress resource is requesting a certificate, we need to install a cert manager.

```kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.16.1/cert-manager.yaml```

---
## Ingress controller

We need an Ingress controller to handle our Ingress resource (```ingress-srv.yaml```).

> ### Local: 

First we need to install an Ingress controller. How to do this can be found [on the Ingress page](https://kubernetes.github.io/ingress-nginx/deploy/#docker-for-mac).

```kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.41.0/deploy/static/provider/cloud/deploy.yaml```

> ### Digital ocean: 

First we need to install an Ingress controller. How to do this can be found [on the Ingress page](https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean).

```kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.41.0/deploy/static/provider/do/deploy.yaml```


---
## Secrets

```kubectl create secret generic jwt-secret --from-literal=JWT_KEY=sdf3d```

```kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<your.super.secret.stripe.key```

```kubectl create secret generic nats-db-passwd-secret --from-literal=NATS_DB_PASSWD=1```


---
## Config maps

```kubectl apply -f infra/k8s-config/*```


## Initialize NATS postgres database (locally)

Since the Nats streaming server is configured to use postgres as data store we need to create the tables. The database is automatically created when it starts for the first time. The PGDATA will be stored in your PV (locally this is at ```/tmp/ticketing/nats-postgres-data```)

> Start by creating the folder on your local machine:

```mkdir -p /tmp/ticketing2/nats-postgres-data```


> Bring up the postgres database:

```k apply -f infra/k8s-dev/local-storage.yaml```

```k apply -f infra/k8s-dev/nats-postgres-pvc.yaml```

```k apply -f infra/k8s/nats-postgres-depl.yaml```

> Port forward from your local host computer into the postgres database:

```k port-forward nats-postgres-depl-<some id here> 5432:5432```

> If you want/need, run this sql script to drop previous tables:

```cat nats-streaming-server/scripts/drop_postgres.db.sql | psql -h 127.0.0.1 nats_streaming 1```

> Create the tables:

```cat nats-streaming-server/scripts/postgres.db.sql | psql -h 127.0.0.1 nats_streaming 1```

> Clean up:

```k delete -f infra/k8s/nats-postgres-depl.yaml```

```k delete -f infra/k8s-dev/nats-postgres-pvc.yaml```

```k delete -f infra/k8s-dev/local-storage.yaml```


## Initialize NATS postgres database (Digital Ocean)

Since the Nats streaming server is configured to use postgres as data store we need to create the tables. The database is automatically created when it starts for the first time. The PGDATA will be stored in your PV.

> Bring up the postgres database:

```k apply -f infra/k8s-prod/nats-postgres-pvc.yaml```

```k apply -f infra/k8s/nats-postgres-depl.yaml```

> Port forward from your local host computer into the postgres database:

```k port-forward nats-postgres-depl-<some id here> 5432:5432```

> If you want/need, run this sql script to drop previous tables:

```cat nats-streaming-server/scripts/drop_postgres.db.sql | psql -h 127.0.0.1 nats_streaming 1```

> Create the tables:

```cat nats-streaming-server/scripts/postgres.db.sql | psql -h 127.0.0.1 nats_streaming 1```

> Clean up:

```k delete -f infra/k8s/nats-postgres-depl.yaml```

## Skaffold (local dev)

```skaffold dev```

after a while, you will see the logs from all the services. If something goes wrong, CTRL-C and try again.