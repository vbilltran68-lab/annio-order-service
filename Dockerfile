FROM node:12.19-alpine

# APP
ARG PORT
ARG DEBUG_PORT
ARG API_PREFIX

# DB
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_NAME

ENV NODE_ENV development
ENV PORT $PORT
ENV DEBUG_PORT $DEBUG_PORT
ENV API_PREFIX $API_PREFIX
ENV DB_HOST $DB_HOST
ENV DB_PORT $DB_PORT
ENV DB_USERNAME $DB_USERNAME
ENV DB_PASSWORD $DB_PASSWORD
ENV DB_NAME $DB_NAME

WORKDIR /usr/src/app

RUN apk update
RUN apk add g++ make python
RUN apk add git bash

COPY package*.json ./

# add yarn
RUN npm i yarn@latest -g --force

RUN yarn install

COPY . .

RUN yarn run build

ENTRYPOINT [ "bash", "./init.sh" ]