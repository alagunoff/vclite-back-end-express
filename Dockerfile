FROM node:18.15.0

WORKDIR /vclite

COPY . .

RUN npm install
