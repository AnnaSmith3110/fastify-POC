# Use an official Node.js 20 image as the base
FROM node:20

# Set the working directory to /app
WORKDIR /app

# Copy the package*.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port the application will run on
EXPOSE 3000

# Run the command to start the development server when the container launches
CMD ["npm", "start"]