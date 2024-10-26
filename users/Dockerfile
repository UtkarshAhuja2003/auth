FROM node:22-alpine

WORKDIR /app/users

COPY package.json .


RUN yarn install

COPY . .

EXPOSE 8000

CMD ["yarn", "dev"]
