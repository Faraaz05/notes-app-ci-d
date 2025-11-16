# Install Dependencies Stage

FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .


# Production Stage

FROM node:18-alpine AS prod
WORKDIR /app

COPY --from=build /app /app

EXPOSE 5000
CMD ["node", "src/server.js"]

