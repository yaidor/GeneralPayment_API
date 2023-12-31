FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port 3000

RUN npm run build

EXPOSE 3000

# Run the app
CMD [ "npm", "run", "start:prod" ]