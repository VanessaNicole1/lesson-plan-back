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
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser
RUN mkdir -p /app
RUN chown -R pptruser /app
USER pptruser
WORKDIR /app
RUN mkdir uploads/
COPY --chown=pptruser:pptruser ./package.json ./
RUN npm install --force
COPY --chown=pptruser:pptruser . .
RUN npx prisma generate
RUN npm run build
ENV TZ=America/Guayaquil
CMD ["npm", "run", "start:prod"]
