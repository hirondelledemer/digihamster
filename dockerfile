# # filename: dockerfile

# # Base image
# FROM node:19-bullseye

# # Get the latest version of Playwright
# FROM mcr.microsoft.com/playwright:v1.34.0-jammy

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package.json yarn.lock ./

# # Install dependencies
# RUN yarn install --ignore-engines

# # Copy the rest of the application files
# COPY . .

# # Set the entry point for the container
# CMD ["yarn", "dev"]


# Get the base image of Node version 16
FROM node:16

# Get the latest version of Playwright
FROM mcr.microsoft.com/playwright:focal
 
# Set the work directory for the application
WORKDIR /app
 
# Set the environment path to node_modules/.bin
ENV PATH /app/node_modules/.bin:$PATH
ENV BASE_URL=http://127.0.0.1:3000

# COPY the needed files to the app folder in Docker image
COPY . .

# Get the needed libraries to run Playwright
RUN apt-get update && apt-get -y install libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon-dev libgbm-dev libasound-dev libatspi2.0-0 libxshmfence-dev

# Install the dependencies in Node environment
RUN yarn install --ignore-engines
