# Use node:18-slim for a much lighter image that fits Render's memory limits
FROM node:18-slim

# Install system dependencies and Oracle Instant Client in one clean step
RUN apt-get update && apt-get install -y libaio1 wget unzip && \
    mkdir -p /opt/oracle && \
    cd /opt/oracle && \
    # Using a direct download link that is more stable for Docker builds
    wget https://download.oracle.com/otn_software/linux/instantclient/1923000/instantclient-basiclite-linux.x64-19.23.0.0.0dbru.zip && \
    unzip instantclient-basiclite-linux.x64-19.23.0.0.0dbru.zip && \
    rm -f instantclient-basiclite-linux.x64-19.23.0.0.0dbru.zip && \
    mv instantclient_* instantclient && \
    # Clean up to keep the image small
    apt-get purge -y wget unzip && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Set the library path for Oracle drivers
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient

# App setup
WORKDIR /usr/src/app
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY . .

EXPOSE 3000
CMD ["node", "backend/server.js"]
