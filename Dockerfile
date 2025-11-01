# Use official Node.js image as base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build if needed (optional)
# RUN npm run build

# Expose the port your MCP server listens on (e.g., 3000)
EXPOSE 3000

# Start the MCP server on port 3000
CMD ["node", "index.js"]
