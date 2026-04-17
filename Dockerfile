# Use Oracle Linux 8 as the base image for robust Oracle Client support
FROM oraclelinux:8

# Install Node.js 18 and Oracle Instant Client Basic Lite
RUN dnf install -y oracle-nodejs-release-el8 && \
    dnf install -y nodejs && \
    dnf install -y oracle-instantclient-release-el8 && \
    dnf install -y oracle-instantclient-basiclite && \
    dnf clean all

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
