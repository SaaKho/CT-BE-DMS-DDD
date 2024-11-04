# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./

# Install all dependencies (including dev dependencies) to ensure we have TypeScript available for building
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript into JavaScript
RUN npm run build

# Expose the port your app will run on
EXPOSE 4000

# Run the compiled JavaScript with Node.js
CMD ["node", "dist/index.js", "start", "--port", "4000"]
