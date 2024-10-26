FROM node:22-alpine

WORKDIR /app/client

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 8000

CMD ["yarn", "dev"]
