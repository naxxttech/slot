FROM node:alpine

WORKDIR /usr/src/app 
# install app dependencies into workdir - package.json & lock.json
COPY package*.json ./

RUN npm ci

# bundle app 
COPY ./src .

CMD ["npm", "start"]