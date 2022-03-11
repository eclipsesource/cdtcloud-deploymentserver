#syntax=docker/dockerfile:1.4

ARG NODE_VERSION_THEIA=12.20.1
ARG ALPINE_VERSION_THEIA=3.12
ARG ARDUINO_VERSION=latest

FROM alpine as arduino-cli
ARG ARDUINO_VERSION
LABEL version=$ARDUINO_VERSION
WORKDIR /usr/src/cli

RUN apk add --update --no-cache curl libc6-compat
RUN curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=/usr/bin sh -s $ARDUINO_VERSION

RUN arduino-cli config init
RUN arduino-cli config add board_manager.additional_urls https://github.com/stm32duino/BoardManagerFiles/raw/main/package_stmicroelectronics_index.json
RUN arduino-cli core update-index
RUN arduino-cli core install arduino:avr
RUN arduino-cli core install arduino:sam
RUN arduino-cli core install STMicroelectronics:stm32

EXPOSE 50051
CMD ["arduino-cli", "daemon", "--port", "50051", "--daemonize", "--verbose"]

FROM node:lts-alpine as fe-builder
WORKDIR /usr/src/app
COPY . .
RUN yarn install --ignore-scripts
RUN yarn --cwd packages/deployment-server-ui run vite build

FROM node:lts-alpine as deployment-server
RUN apk add dumb-init
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY packages/deployment-server/package.json ./
COPY yarn.lock ./
COPY packages/deployment-server/tsconfig.json ./
RUN yarn install --frozen-lockfile --production=true --ignore-scripts --cache-folder /tmp/.ycache; rm -rf /tmp/.ycache

COPY --chown=node packages/deployment-server/src ./src
COPY --chown=node packages/deployment-server/prisma ./prisma
COPY --chown=node:node --from=fe-builder /usr/src/app/packages/deployment-server-ui/dist ./public
RUN mkdir uploads && chown -R node ./uploads
RUN yarn run prisma generate
USER node

EXPOSE 3001
CMD ["dumb-init", "node", "--loader", "esbuild-node-loader", "src/index.ts"]

FROM node:lts-alpine as device-connector

LABEL description='Device-Connector image for cdtcloud-deploymentserver'

WORKDIR /usr/src/app

# Create and own necessary folders and files
RUN mkdir -p logs/device-connector
RUN mkdir artifacts
ADD .docker/device-connector/docker-cmd.sh ./
RUN chmod +x docker-cmd.sh
RUN chown -R node:node .

# Get and install required modules
COPY --chown=node packages/device-connector/package.json ./
COPY --chown=node ./yarn.lock ./
COPY --chown=node packages/device-connector/tsconfig.json ./
RUN yarn install --frozen-lockfile --ignore-scripts

# Get required source files for device-connector
COPY --chown=node packages/device-connector/src ./src
COPY --chown=node packages/grpc/proto /usr/src/grpc/proto

USER node

CMD ["node", "--loader", "esbuild-node-loader", "src/index.ts"]

FROM node:${NODE_VERSION_THEIA}-alpine${ALPINE_VERSION_THEIA} as cdtcloud-widget
RUN apk add --no-cache make pkgconfig gcc g++ python3 libx11-dev libxkbfile-dev libsecret-dev
WORKDIR /home/theia
COPY ./yarn.lock .
COPY ./package.json .
COPY ./lerna.json .
COPY ./packages/theia-extension/cdtcloud ./packages/theia-extension/cdtcloud
COPY ./packages/grpc ./packages/grpc
COPY ./packages/theia-extension/browser-app ./packages/theia-extension/browser-app
RUN yarn --pure-lockfile && \
  NODE_OPTIONS="--max_old_space_size=4096" yarn build:theia && \
  yarn --cwd=packages/theia-extension/cdtcloud theia download:plugins && \
  yarn --production && \
  yarn autoclean --init && \
  echo **/*.ts >> .yarnclean && \
  echo **/*.ts.map >> .yarnclean && \
  echo **/*.spec.* >> .yarnclean && \
  yarn autoclean --force && \
  yarn cache clean

FROM node:${NODE_VERSION_THEIA}-alpine${ALPINE_VERSION_THEIA} as cdtcloud-theia
# See : https://github.com/theia-ide/theia-apps/issues/34
RUN addgroup theia && \
  adduser -G theia -s /bin/sh -D theia;
RUN chmod g+rw /home && \
  mkdir -p /home/project && \
  #mkdir -p /home/cli && \
  chown -R theia:theia /home/theia && \
  #chown -R theia:theia /home/cli && \
  chown -R theia:theia /home/project;
RUN apk add --update --no-cache git openssh bash libsecret lsblk
ENV HOME /home/theia
WORKDIR /home/theia
COPY --from=cdtcloud-widget --chown=theia:theia /home/theia /home/theia
COPY --from=cdtcloud-widget --chown=theia:theia /home/theia/packages/theia-extension/cdtcloud/plugins /home/theia/plugins
#COPY --from=1 --chown=theia:theia /usr/src/arduino /usr/local/bin
EXPOSE 3000
ENV SHELL=/bin/bash \
  THEIA_DEFAULT_PLUGINS=local-dir:/home/theia/plugins
ENV USE_LOCAL_GIT true
USER theia
ENTRYPOINT [ "node", "/home/theia/packages/theia-extension/browser-app/src-gen/backend/main.js", "/home/project", "--hostname=0.0.0.0"]
