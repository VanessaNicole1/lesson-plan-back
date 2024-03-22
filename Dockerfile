FROM node:16.19.0-alpine
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn \
      tzdata

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
WORKDIR /app
RUN mkdir uploads/
COPY ./package.json ./
RUN npm install --force
COPY . .
RUN npx prisma generate
RUN npm run build
ENV TZ=America/Guayaquil
CMD ["npm", "run", "start:prod"]
