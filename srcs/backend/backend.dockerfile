# ################
# # 🧑‍💻 Development
# ################

FROM node:19-alpine as develop
WORKDIR /app
COPY ./app/package.json ./
RUN yarn install --non-interactive
RUN yarn global add @nestjs/cli
COPY app .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start:dev"]

# ######################
# # 🚀 Production Server
# ######################
FROM node:19-alpine as production
WORKDIR /app
COPY ./app/package.json ./
RUN yarn install --non-interactive
RUN yarn global add @nestjs/cli
COPY app .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start:prod"]