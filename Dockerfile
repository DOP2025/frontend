# --- Stage 1: Build the Application Assets ---
# Use a Node.js base image (e.g., LTS version 20-alpine) as the builder
FROM node:21-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to allow Docker to cache dependencies layer
# This speeds up subsequent builds if dependencies haven't changed
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Execute the production build command (creates the static files in the 'dist' or 'build' folder)
# Use 'npm run build' for most React projects (Vite, CRA, etc.)
RUN npm run build

# --- Stage 2: Serve the Static Files with Nginx ---
# Use a lightweight Nginx image for serving (small and secure)
FROM nginx:alpine

# Copy custom Nginx configuration (optional but recommended for Single-Page Applications)
# Create a 'nginx.conf' file in your project root if you uncomment this:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove the default Nginx index.html and configuration directory
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]