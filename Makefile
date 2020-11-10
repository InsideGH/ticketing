build_prod: lint
	(cd auth && docker build -f Dockerfile.prod .)
	(cd expiration && docker build -f Dockerfile.prod .)
	(cd orders && docker build -f Dockerfile.prod .)
	(cd payments && docker build -f Dockerfile.prod .)
	(cd tickets && docker build -f Dockerfile.prod .)

lint:
	(cd auth && npm run lint)
	(cd expiration && npm run lint)
	(cd orders && npm run lint)
	(cd payments && npm run lint)
	(cd tickets && npm run lint)

test:
	(cd auth && npm run test:ci)
	(cd orders && npm run test:ci)
	(cd payments && npm run test:ci)
	(cd tickets && npm run test:ci)

prod_pipeline: lint test build_prod