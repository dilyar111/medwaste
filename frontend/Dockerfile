FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
# Копируем ВООБЩЕ ВСЕ файлы из папки frontend в /app внутри контейнера
COPY . . 
# Проверяем, что index.html попал в корень
RUN ls -la 
RUN npm run build