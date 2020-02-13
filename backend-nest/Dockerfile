FROM node:lts-alpine
WORKDIR /app
COPY ./dist /app/dist
COPY ./package.json /app
COPY ./.env.example /app/.env
# COPY ./yarn.lock /app
RUN npm config set proxy null
RUN npm install --production --registry=https://registry.npm.taobao.org
RUN npm install pm2 -g
EXPOSE 3000
CMD ["pm2-runtime", "dist/src/main.js"]