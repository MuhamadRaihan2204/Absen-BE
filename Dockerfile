# Gunakan Node.js versi LTS sebagai base image
FROM node:20

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json ke dalam direktori kerja
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin sisa file aplikasi
COPY . .

# Expose port yang akan digunakan aplikasi (biasanya 3000 untuk aplikasi Node.js)
EXPOSE 5000

# Perintah untuk menjalankan aplikasi
CMD ["sh", "-c", "npm start"]
