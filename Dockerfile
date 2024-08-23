FROM node:alpine as build-step

ARG GUARDIAN_KEY
ARG NY_TIMES_KEY
ARG NEWS_API_KEY
ENV VITE_GUARDIAN_KEY=$GUARDIAN_KEY
ENV VITE_NY_TIMES_KEY=$NY_TIMES_KEY
ENV VITE_NEWS_API_KEY=$NEWS_API_KEY

RUN mkdir -p /app
RUN npm cache clear --force
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build 

#stage2
FROM nginx
COPY --from=build-step /app/dist /usr/share/nginx/html

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]