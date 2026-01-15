# Use lightweight official Node.js image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (better layer caching for CI/CD)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy rest of the application code
COPY . .

# Expose application port (change if your app uses a different port)
EXPOSE 3000


