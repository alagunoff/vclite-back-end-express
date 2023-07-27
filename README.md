# Back end for VClite

Back end is powered by [Express](https://expressjs.com/). API is documented using [Swagger](https://swagger.io/).

## Installation

1. Clone project
2. Install project's dependencies by, for example, `npm i` command in project's root folder

## Starting dev server

1. Install [Docker](https://www.docker.com/) on your machine
2. Run app's necessary services by `docker compose up` command in project's root folder
3. Apply latest migration by `npx prisma migrate dev` command in project's root folder
4. Start dev server by `npm run dev` command in project's root folder
