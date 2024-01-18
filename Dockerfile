FROM node:20 as build

RUN apt-get update && apt-get install -y cron

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