# Tasknest

Tasknest is a simple task tracking API.
Users can create tasks and mark them as "to do", "in progress" or "done".
Basic JWT authentication and authorization are employed so that a user can't access another user's tasks.

A deploy can be found at <https://tasknest.vercel.app>.
The API uses Swagger UI for automatic documentation, which can be accessed at the [`/swagger`](https://tasknest.vercel.app/swagger) endpoint.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
