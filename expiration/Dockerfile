FROM node:alpine

WORKDIR /usr/app

COPY './package*.json' ./

RUN npm i --omit=dev

COPY ./ ./

CMD ["npm", "start"]