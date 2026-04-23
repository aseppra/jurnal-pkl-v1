# Stage 1: Build Frontend (React + Vite)
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Backend (PHP-FPM + Nginx)
FROM serversideup/php:8.3-fpm-nginx AS backend
WORKDIR /var/www/html

# Install dependensi sistem yang diperlukan (opsional)
USER root
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Kembali ke user default (untuk keamanan)
USER www-data

# Copy composer files
COPY --chown=www-data:www-data composer*.json ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy seluruh aplikasi
COPY --chown=www-data:www-data . .

# Copy hasil build React dari Stage 1
COPY --chown=www-data:www-data --from=frontend-builder /app/public/build ./public/build

# Finalisasi Composer
RUN composer dump-autoload --optimize

# Environment variables dasar untuk produksi
ENV AUTORUN_ENABLED=true
ENV PHP_OPCACHE_ENABLE=1
