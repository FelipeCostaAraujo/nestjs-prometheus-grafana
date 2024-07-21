FROM node:20-slim

RUN apt-get update && apt-get install -y openssl

WORKDIR /home/node/app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]