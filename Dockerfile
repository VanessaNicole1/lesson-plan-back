FROM node:16.19.0-alpine

WORKDIR /app

RUN mkdir uploads/

COPY ./package.json ./

RUN npm install 

COPY . .

RUN npx prisma generate

RUN npm run build

CMD ["npm", "run", "start:prod"]
