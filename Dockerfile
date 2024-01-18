FROM node:20 as build

RUN apt-get update && apt-get install -y cron

RUN apt-get update && apt-get install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils

ENV NODE_ENV production

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY ./ ./

RUN npx prisma generate && npx prisma db push 

RUN npm run build

COPY ./cron/runapi /etc/cron.d/runapi

RUN chmod 0644 /etc/cron.d/runapi && \
  crontab /etc/cron.d/runapi

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD npm run start