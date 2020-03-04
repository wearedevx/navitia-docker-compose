FROM node:10-alpine

WORKDIR /app

RUN npm i -g nodemon

COPY . /app

RUN npm install --only=prod

EXPOSE 5000

CMD ["npm", "run", "start"]
