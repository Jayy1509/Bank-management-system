# Use a Debian-based image for compatibility with Oracle Instant Client
FROM node:18-bullseye-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libaio1 \
    unzip \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install Oracle Instant Client for Linux x64
WORKDIR /opt/oracle
RUN wget https://download.oracle.com/otn_software/linux/instantclient/2114000/instantclient-basiclite-linuxx64.zip && \
    unzip instantclient-basiclite-linuxx64.zip && \
    rm -f instantclient-basiclite-linuxx64.zip && \
    mv instantclient_* instantclient

# Set the library path so the app can find the Oracle client
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient

# Set working directory for the app
WORKDIR /usr/src/app

# Copy the backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /usr/src/app/backend
RUN npm install

# Copy all project files (frontend and backend)
WORKDIR /usr/src/app
COPY . .

# Expose port (Render sets PORT environment variable automatically)
EXPOSE 3000

# Start server
CMD ["node", "backend/server.js"]
