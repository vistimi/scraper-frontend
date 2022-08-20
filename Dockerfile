FROM node:12

WORKDIR /usr/app

# copy all files 
COPY . .

# install for production
RUN npm install

RUN npm run build

# remove all files from devDependencies
RUN npm prune --production

EXPOSE 3000

CMD [ "npm", "run", "start" ]