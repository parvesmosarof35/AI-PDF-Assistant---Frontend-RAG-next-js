# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the entire frontend directory
COPY . .

# Pass the API URLs as build arguments
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_AUTH_URL
ENV NEXT_PUBLIC_AUTH_URL=$NEXT_PUBLIC_AUTH_URL

# Build the Next.js application
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 8001

# Command to run the frontend server
CMD ["npm", "start", "--", "-p", "8001"]
