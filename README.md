# What this?

This repo contains the output from the Udemy course [Microservices with NodeJS and React](https://www.udemy.com/course/microservices-with-node-js-and-react) with some changes on the way.

+ Added TLS support.
+ The NextJS client setup is more inline with 5-nov-2020 version of NextJS with static/hybrid/client ways of rendering pages.

# Get going locally on a clean kubernetes cluster

## 1 Ingress controller

First we need to install an Ingress controller. How to do this can be found [on the Ingress page](https://kubernetes.github.io/ingress-nginx/deploy/#docker-for-mac).

```kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.41.0/deploy/static/provider/cloud/deploy.yaml```

You should see output like this ->

```
namespace/ingress-nginx created
serviceaccount/ingress-nginx created
configmap/ingress-nginx-controller created
clusterrole.rbac.authorization.k8s.io/ingress-nginx created
clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx created
role.rbac.authorization.k8s.io/ingress-nginx created
rolebinding.rbac.authorization.k8s.io/ingress-nginx created
service/ingress-nginx-controller-admission created
service/ingress-nginx-controller created
deployment.apps/ingress-nginx-controller created
validatingwebhookconfiguration.admissionregistration.k8s.io/ingress-nginx-admission created
serviceaccount/ingress-nginx-admission created
clusterrole.rbac.authorization.k8s.io/ingress-nginx-admission created
clusterrolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
role.rbac.authorization.k8s.io/ingress-nginx-admission created
rolebinding.rbac.authorization.k8s.io/ingress-nginx-admission created
job.batch/ingress-nginx-admission-create created
job.batch/ingress-nginx-admission-patch created
```

## 2 Secrets

```kubectl create secret generic jwt-secret --from-literal=JWT_KEY=sdf3d```

```kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<your.super.secret.stripe.key```

You should see output like this on both creates -> 

```secret/jwt-secret created```

## 3 Skaffold

```skaffold dev```

after a while, you will see the logs from all the services. If something goes wrong, CTRL-C and try again.