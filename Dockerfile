# Gunakan base image Node.js
FROM node:18

# Set work directory
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file ke work directory
COPY . .

# Ekspos port aplikasi
EXPOSE 8080

# Jalankan aplikasi
CMD ["npm", "start"]
