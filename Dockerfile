FROM node:18-alpine AS base
WORKDIR /app
COPY . .
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite

RUN npm i --production
RUN npm run build

CMD [ "npm", "start" ]