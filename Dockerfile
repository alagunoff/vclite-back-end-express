FROM node:18.15.0 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npm pkg delete scripts.prepare

FROM node:18.15.0
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder ["/app/package.json", "/app/package-lock.json", "/app/api-docs.json", "./"]
COPY --from=builder ./app/prisma ./prisma
COPY --from=builder ./app/dist ./dist
RUN npm install
CMD ["node", "./dist/server.js"]