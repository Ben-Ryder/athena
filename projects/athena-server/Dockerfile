# Use latest LTS node
FROM node:16

# Create app directory for project
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose 8080 port
EXPOSE 8080

# Build project
RUN npm run build

# Start project
CMD [ "node", "build/server.js" ]
