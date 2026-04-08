# Tasknest

Tasknest is a simple task tracking API.
Users can create tasks and mark them as "to do", "in progress" or "done".
Basic JWT authentication and authorization are employed so that a user can't access another user's tasks.

An official deploy can be found at <https://tasknest-ev7z.onrender.com>.
The API uses Swagger UI for automatic documentation, which can be accessed at the [`/swagger`](https://tasknest-ev7z.onrender.com/swagger) endpoint.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
