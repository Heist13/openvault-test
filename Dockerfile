FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY .env ./

# Install app dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app will run on
EXPOSE 3001

# Define the command to run your application
CMD ["yarn", "start"]