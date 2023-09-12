## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## DB Setup

1. First install the software 'pgAdmin' in your local machine. You can download from here : https://www.pgadmin.org/download/
2. Create a user in 'pgAdmin'.

## '.env' file

1. create '.env' file in root directory.
2. Copy the code from 'sample.env' file.
3. Paste the code in '.env' file.
4. Now fille up these variable :
   POSTGRES_USER=
   POSTGRES_PASSWORD=
   POSTGRES_DATABASE=
   You can set other variable as your wish.

## JWT secret key and expriration time

Must fill the variable 'AUTH_SECRET' for JWT secret key.
JWT_EXPIRATION_TIME_SECONDS='value must a number of seconds'
JWT_REFRESH_TOKEN_SECRET=
JWT_REFRESH_EXPIRATION_TIME_SECONDS='value must a number of seconds'

## Installation

To Install all packages used in this project run the following command.

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Insert Data

After successfully running the project we have to insert some data.
Please run the queries what written in 'db-scripts.sql' file.

## Swagger API Documentation

Visit the given link in the log for the detailed API documentation.
