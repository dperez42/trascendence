################
# 🧑‍💻 develop
################
FROM node:18-bullseye as develop

# ENV NPM_CONFIG_LOGLEVEL info

#RUN yarn global add @vue/cli
#RUN yarn global add @vue/cli-init
#RUN yarn global add @vue/cli-plugin-typescript

# Create app folder
WORKDIR /app

# Copia solo los archivos de dependencias primero
COPY app/package*.json ./

# Install dependencies
RUN yarn install  --non-interactive

# Copy source code into app folder
COPY app .

#####################
# 🏡 Production Build
#####################
FROM develop as build

# build
RUN yarn build

#######################
#  🚀 Production Server
#######################
FROM nginx:1.15.7-alpine as production

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
#CMD ["./node_modules/.bin/vue-cli-service", "serve"]

