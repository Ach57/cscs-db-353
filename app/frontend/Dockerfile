FROM node:20-alpine
WORKDIR /app
COPY package*.json tsconfig*.json vite.config.ts index.html ./
RUN npm install
COPY src/ ./src/
ARG VITE_API_URL
RUN npm run build
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]
