FROM node:latest as node

WORKDIR /app
COPY package*.json ./

RUN npm install
RUN npm install sqlite3
COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]