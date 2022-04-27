ARG NODE_VERSION=17
ARG ARDUINO_VERSION=0.21.1
ARG USER_ID=2000
ARG GROUP_ID=2000
ARG DOCKER_USER=cdtcloud

FROM node:$NODE_VERSION as base
ARG USER_ID
ARG GROUP_ID
ARG DOCKER_USER

LABEL description="CdtCloud base image"

ENV DOCKER=1

# Set timezone environment variable
ENV TZ=Etc/UTC

# Set noninteractive mode so tzdata doesn't ask to set timezone on install
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends git sudo curl tzdata dumb-init jq build-essential make pkg-config gcc g++ python3 libx11-dev libxkbfile-dev libsecret-1-dev ca-certificates

# Update ca-certificates
RUN update-ca-certificates

# Change timezone in container
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && dpkg-reconfigure --frontend noninteractive tzdata

RUN addgroup --gid $GROUP_ID $DOCKER_USER && \
    adduser --disabled-password --gecos '' --uid $USER_ID --gid $GROUP_ID $DOCKER_USER && \
    passwd -d $DOCKER_USER && \
    echo "$DOCKER_USER ALL=(ALL:ALL) NOPASSWD: ALL" >> /etc/sudoers

# Create necessary directories
RUN mkdir -p /cdtcloud/project
RUN mkdir -p /cdtcloud/deployment-server
RUN mkdir -p /cdtcloud/public
RUN mkdir -p /cdtcloud/device-connector
RUN mkdir -p /cdtcloud/theia
RUN mkdir -p /cdtcloud/grpc

# Correct permissions for non-root operations
RUN chown -R $DOCKER_USER:$DOCKER_USER /home/$DOCKER_USER
RUN chown -R $DOCKER_USER:$DOCKER_USER /run
RUN chown -R $DOCKER_USER:$DOCKER_USER /opt
RUN chown -R $DOCKER_USER:$DOCKER_USER /cdtcloud

USER $DOCKER_USER

WORKDIR /cdtcloud/

FROM ubuntu:20.04 as arduino-cli
ARG ARDUINO_VERSION
ARG USER_ID
ARG GROUP_ID
ARG DOCKER_USER

LABEL description="Arduino-Cli image for cdtcloud-deploymentserver"
LABEL version=$ARDUINO_VERSION

ENV DOCKER=1

# Set timezone environment variable
ENV TZ=Etc/UTC

# Set noninteractive mode so tzdata doesn't ask to set timezone on install
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends curl tzdata ca-certificates

# Update ca-certificates
RUN update-ca-certificates

# change timezone in container
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && dpkg-reconfigure --frontend noninteractive tzdata

RUN addgroup --gid $GROUP_ID $DOCKER_USER && \
    adduser --disabled-password --gecos '' --uid $USER_ID --gid $GROUP_ID $DOCKER_USER && \
    passwd -d $DOCKER_USER && \
    echo "$DOCKER_USER ALL=(ALL:ALL) NOPASSWD: ALL" >> /etc/sudoers

RUN curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=/usr/local/bin sh -s $ARDUINO_VERSION

USER $DOCKER_USER

RUN arduino-cli config init
RUN arduino-cli config add board_manager.additional_urls https://github.com/stm32duino/BoardManagerFiles/raw/main/package_stmicroelectronics_index.json
RUN arduino-cli update
RUN arduino-cli core install arduino:avr
RUN arduino-cli core install arduino:sam
RUN arduino-cli core install STMicroelectronics:stm32

EXPOSE 50051
CMD ["arduino-cli", "daemon", "--ip", "0.0.0.0", "--port", "50051", "--daemonize", "--verbose", "--no-color"]

FROM base as build
ARG DOCKER_USER

LABEL description="CdtCloud image used to generate build files"

COPY --chown=$DOCKER_USER:$DOCKER_USER . /cdtcloud/build

WORKDIR /cdtcloud/build

RUN yarn install --ignore-scripts
RUN yarn --cwd=packages/deployment-server-ui run vite build

FROM base as deployment-server
ARG DOCKER_USER

LABEL description='Deployment-Server image for cdtcloud-deploymentserver'

ENV NODE_ENV=production

RUN mkdir -p /cdtcloud/deployment-server/uploads
RUN chown -R $DOCKER_USER:$DOCKER_USER /cdtcloud/deployment-server/uploads

COPY packages/deployment-server/package.json /cdtcloud/deployment-server/
COPY yarn.lock /cdtcloud/deployment-server/
COPY packages/deployment-server/tsconfig.json /cdtcloud/deployment-server/

COPY --chown=$DOCKER_USER:$DOCKER_USER packages/deployment-server/src /cdtcloud/deployment-server/src
COPY --chown=$DOCKER_USER:$DOCKER_USER packages/deployment-server/prisma /cdtcloud/deployment-server/prisma
COPY --chown=$DOCKER_USER:$DOCKER_USER --from=build /cdtcloud/build/packages/deployment-server-ui/dist /cdtcloud/deployment-server/public

WORKDIR /cdtcloud/deployment-server

RUN yarn install --frozen-lockfile --production=true --ignore-scripts --cache-folder /tmp/.ycache; rm -rf /tmp/.ycache
RUN yarn run prisma generate

EXPOSE 3001
CMD ["/bin/bash", "-c", "yarn update:db && dumb-init node --loader esbuild-node-loader src/index.ts"]

FROM base as device-connector
ARG DOCKER_USER

LABEL description='Device-Connector image for cdtcloud-deploymentserver'

ENV NODE_ENV=production

RUN mkdir -p /cdtcloud/device-connector/artifacts
RUN chown -R $DOCKER_USER:$DOCKER_USER /cdtcloud/device-connector/artifacts

COPY packages/device-connector/package.json /cdtcloud/device-connector/
COPY yarn.lock /cdtcloud/device-connector/
COPY packages/device-connector/tsconfig.json /cdtcloud/device-connector/

COPY --chown=$DOCKER_USER:$DOCKER_USER packages/device-connector/src /cdtcloud/device-connector/src
COPY --chown=$DOCKER_USER:$DOCKER_USER packages/grpc/proto /cdtcloud/grpc/proto

WORKDIR /cdtcloud/device-connector

RUN yarn install --frozen-lockfile --production=true --ignore-scripts --cache-folder /tmp/.ycache; rm -rf /tmp/.ycache

CMD ["dumb-init", "node", "--loader", "esbuild-node-loader", "src/index.ts"]

FROM base as theia-build
ARG DOCKER_USER
# electron libs:
# libx11-xcb-dev libxcb-dri3-dev libxcomposite-dev libxcursor-dev libxdamage-dev libxi-dev libxtst-dev libnss3-dev libatk1.0-dev libatk-bridge2.0-dev libgtk-3-dev libxss-dev libasound-dev

COPY --chown=$DOCKER_USER:$DOCKER_USER yarn.lock /cdtcloud/theia/
COPY --chown=$DOCKER_USER:$DOCKER_USER package.json /cdtcloud/theia/
COPY --chown=$DOCKER_USER:$DOCKER_USER lerna.json /cdtcloud/theia/
COPY --chown=$DOCKER_USER:$DOCKER_USER packages/theia-extension/cdtcloud /cdtcloud/theia/packages/theia-extension/cdtcloud
COPY --chown=$DOCKER_USER:$DOCKER_USER packages/grpc /cdtcloud/theia/packages/grpc
COPY --chown=$DOCKER_USER:$DOCKER_USER packages/theia-extension/browser-app /cdtcloud/theia/packages/theia-extension/browser-app

WORKDIR /cdtcloud/theia

RUN yarn install --purge-lockfile
RUN NODE_OPTIONS="--max_old_space_size=4096" yarn build:browser
RUN yarn --cwd=packages/theia-extension/cdtcloud theia download:plugins
RUN yarn --production=true
RUN yarn autoclean --init
RUN echo **/*.ts >> .yarnclean
RUN echo **/*.ts.map >> .yarnclean
RUN echo **/*.spec.* >> .yarnclean
RUN yarn autoclean --force
RUN yarn cache clean

FROM base as cdtcloud-theia
ARG DOCKER_USER

LABEL description="CdtCloud theia image"

ENV HOME /home/$DOCKER_USER
ENV SHELL=/bin/bash
ENV THEIA_DEFAULT_PLUGINS=local-dir:/cdtcloud/theia/plugins
ENV USE_LOCAL_GIT true

COPY --from=theia-build --chown=$DOCKER_USER:$DOCKER_USER /cdtcloud/theia /cdtcloud/theia
COPY --from=theia-build --chown=$DOCKER_USER:$DOCKER_USER /cdtcloud/theia/packages/theia-extension/cdtcloud/plugins /cdtcloud/theia/plugins
COPY --from=arduino-cli /usr/local/bin/arduino-cli /usr/local/bin/arduino-cli
COPY --from=arduino-cli --chown=$DOCKER_USER:$DOCKER_USER /home/$DOCKER_USER/.arduino15 /home/$DOCKER_USER/.arduino15

RUN (while true; do arduino-cli daemon --port 50051 --daemonize --no-color; done) &

WORKDIR /cdtcloud/theia

EXPOSE 3000
ENTRYPOINT ["node", "packages/theia-extension/browser-app/src-gen/backend/main.js", "/home/project", "--hostname=0.0.0.0"]

FROM base as demo
ARG DOCKER_USER
ARG ARDUINO_VERSION
ARG NODE_VERSION_THEIA
ARG YARN_VERSION_THEIA=1.22.5

LABEL description="CdtCloud demo image"

ENV SHELL=/bin/bash
ENV NODE_ENV=demo

USER root
RUN yarn global add concurrently --prefix /usr/local

USER $DOCKER_USER
COPY --from=arduino-cli /usr/local/bin/arduino-cli /usr/local/bin/arduino-cli
COPY --from=arduino-cli --chown=$DOCKER_USER:$DOCKER_USER /home/$DOCKER_USER/.arduino15 /home/$DOCKER_USER/.arduino15
COPY --from=deployment-server --chown=$DOCKER_USER:$DOCKER_USER /cdtcloud/deployment-server/ /cdtcloud/deployment-server/
COPY --from=deployment-server --chown=$DOCKER_USER:$DOCKER_USER /cdtcloud/public/ /cdtcloud/public/
COPY --from=device-connector --chown=$DOCKER_USER:$DOCKER_USER /cdtcloud/device-connector/ /cdtcloud/device-connector/
COPY --from=device-connector --chown=$DOCKER_USER:$DOCKER_USER /cdtcloud/grpc/ /cdtcloud/grpc/
COPY --from=cdtcloud-theia --chown=$DOCKER_USER:$DOCKER_USER /cdtcloud/theia/ /cdtcloud/theia/

EXPOSE 3000
EXPOSE 3001

CMD ["/bin/bash", "-c", "yarn --cwd=deployment-server update:db && dumb-init concurrently --restart-tries -1 -n arduino-cli,deployment-server,device-connector,theia \"arduino-cli daemon --port 50051 --daemonize --no-color --verbose\" \"yarn --cwd=deployment-server start\" \"yarn --cwd=device-connector start\" \"yarn --cwd=theia/packages/theia-extension/browser-app/src-gen/backend/main.js start --hostname=0.0.0.0\""]
