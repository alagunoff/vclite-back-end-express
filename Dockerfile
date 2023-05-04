FROM node:18.15.0 as base
WORKDIR /vclite
COPY ./package.json ./package-lock.json

FROM base as development
ENV NODE_ENV=development
COPY . .
RUN npm install

FROM base as production
ENV NODE_ENV=production
COPY . .
RUN npm ci
