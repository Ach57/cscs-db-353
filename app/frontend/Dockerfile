FROM node:20-alpine
WORKDIR /app
COPY package*.json tsconfig*.json vite.config.ts index.html ./
RUN npm install
# src/ is volume-mounted at runtime — changes hot-reload via vite
CMD ["npm", "run", "dev"]
