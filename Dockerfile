# Use the latest LTS version of node with Alpine.
FROM node:lts-alpine

WORKDIR /usr/src/app


COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .
CMD yarn start
