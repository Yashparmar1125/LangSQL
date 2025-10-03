FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
COPY service-account.json ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/server.js"]
