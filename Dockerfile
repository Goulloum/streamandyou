FROM node

COPY ./package.json /app/
WORKDIR /app/

RUN npm install && npm install -g ts-node

COPY . /app/

EXPOSE 8080


CMD ["ts-node", "src/server.ts"]


