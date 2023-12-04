# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install application dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Expose a port (if your application uses one)
EXPOSE 3000

# Define the command to start your application
CMD ["yarn", "start"]