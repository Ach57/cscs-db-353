FROM node:20-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
# src/ is volume-mounted at runtime — changes hot-reload via tsx watch
CMD ["npm", "run", "dev"]
