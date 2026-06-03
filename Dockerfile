FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build

EXPOSE 5001
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5001

CMD ["node", "dist/index.cjs"]
