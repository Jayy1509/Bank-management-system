# Use the official Node.js image with Oracle Client support if needed
# We can use standard node as oracledb from version 6 is "Thin" mode by default, which means it doesn't require Oracle Client libraries!
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy the backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /usr/src/app/backend
RUN npm install

# Copy all project files (frontend and backend)
WORKDIR /usr/src/app
COPY backend ./backend
COPY frontend ./frontend

# Expose port (Render sets PORT environment variable automatically)
EXPOSE 3000

# Start server
CMD ["node", "backend/server.js"]
