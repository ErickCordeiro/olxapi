FROM node:18.12.1-alpine

WORKDIR /user/app

COPY package.json package-lock.json ./

RUN npm i

COPY  . .

EXPOSE 30202

CMD [ "npm", "start" ]