FROM node:20
COPY . /api
WORKDIR /api
RUN npm install

EXPOSE 8080
CMD ["node", "index.js"]