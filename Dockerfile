ARG NODE_VERSION=17
ARG NODE_VERSION_THEIA=12.20.1
ARG ALPINE_VERSION_THEIA=3.12
ARG ARDUINO_VERSION=0.20.0
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

RUN apt-get update && apt-get install -y git sudo curl tzdata dumb-init jq build-essential make pkg-config gcc g++ python3 libx11-dev libxkbfile-dev libsecret-1-dev

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

RUN apt-get update && apt-get install -y curl tzdata

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
CMD ["arduino-cli", "daemon", "--port", "50051", "--daemonize", "--verbose", "--no-color"]

FROM base as build
ARG DOCKER_USER

LABEL description="CdtCloud image used to generate build files"

COPY --chown=$DOCKER_USER:$DOCKER_USER . /cdtcloud/build

WORKDIR /cdtcloud/build

RUN yarn install --ignore-scripts
RUN yarn --cwd packages/deployment-server-ui run vite build

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
COPY --chown=$DOCKER_USER:$DOCKER_USER --from=build /cdtcloud/build/packages/deployment-server-ui/dist /cdtcloud/public

WORKDIR /cdtcloud/deployment-server

RUN yarn install --frozen-lockfile --production=true --ignore-scripts --cache-folder /tmp/.ycache; rm -rf /tmp/.ycache
RUN yarn run prisma generate

EXPOSE 3001
CMD ["dumb-init", "node", "--loader", "esbuild-node-loader", "src/index.ts"]

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

FROM node:$NODE_VERSION_THEIA as theia-base
ARG USER_ID
ARG GROUP_ID
ARG DOCKER_USER

ENV DOCKER=1

RUN apt-get update && apt-get install -y dumb-init jq build-essential make pkg-config gcc g++ python3 libx11-dev libxkbfile-dev libsecret-1-dev
#gyp
RUN addgroup --gid $GROUP_ID $DOCKER_USER && \
    adduser --disabled-password --gecos '' --uid $USER_ID --gid $GROUP_ID $DOCKER_USER && \
    passwd -d $DOCKER_USER

# Create necessary directories
RUN mkdir -p /cdtcloud/theia

# Correct permissions for non-root operations
RUN chown -R $DOCKER_USER:$DOCKER_USER /cdtcloud/theia
RUN chown -R $DOCKER_USER:$DOCKER_USER /home/$DOCKER_USER

USER $DOCKER_USER

WORKDIR /cdtcloud/theia

FROM base as cdtcloud-widget
ARG DOCKER_USER

COPY --chown=$DOCKER_USER:$DOCKER_USER yarn.lock /cdtcloud/theia/
COPY --chown=$DOCKER_USER:$DOCKER_USER package.json /cdtcloud/theia/
COPY --chown=$DOCKER_USER:$DOCKER_USER lerna.json /cdtcloud/theia/
COPY --chown=$DOCKER_USER:$DOCKER_USER packages/theia-extension/cdtcloud /cdtcloud/theia/packages/theia-extension/cdtcloud
COPY --chown=$DOCKER_USER:$DOCKER_USER packages/grpc /cdtcloud/theia/packages/grpc
COPY --chown=$DOCKER_USER:$DOCKER_USER packages/theia-extension/browser-app /cdtcloud/theia/packages/theia-extension/browser-app

RUN echo $PWD
WORKDIR /cdtcloud/theia
RUN echo $PWD

RUN yarn install --purge-lockfile
RUN NODE_OPTIONS="--max_old_space_size=4096" yarn build:theia
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

ENV HOME /home/$DOCKER_USER
ENV SHELL=/bin/bash
ENV THEIA_DEFAULT_PLUGINS=local-dir:/cdtcloud/theia/plugins
ENV USE_LOCAL_GIT true

COPY --from=cdtcloud-widget --chown=$DOCKER_USER:$DOCKER_USER /cdtcloud/theia /cdtcloud/theia
COPY --from=cdtcloud-widget --chown=$DOCKER_USER:$DOCKER_USER /cdtcloud/theia/packages/theia-extension/cdtcloud/plugins /cdtcloud/theia/plugins
COPY --from=arduino-cli /usr/local/bin/arduino-cli /usr/local/bin/arduino-cli
COPY --from=arduino-cli --chown=$DOCKER_USER:$DOCKER_USER /home/$DOCKER_USER/.arduino15 /home/$DOCKER_USER/.arduino15

RUN (while true; do arduino-cli daemon --port 50051 --daemonize --no-color; done) &

WORKDIR /cdtcloud/theia

EXPOSE 3000
ENTRYPOINT ["node", "packages/theia-extension/browser-app/src-gen/backend/main.js", "/home/project", "--hostname=0.0.0.0"]

#FROM base as demo-base
#ARG DOCKER_USER
#ARG NODE_VERSION_THEIA
#ARG YARN_VERSION_THEIA=1.22.5
#
#RUN mkdir -p node-theia
#RUN chown -R $DOCKER_USER:$DOCKER_USER node-theia
#
## Install node for theia
#RUN ARCH= && dpkgArch="$(dpkg --print-architecture)" \
#  && case "${dpkgArch##*-}" in \
#    amd64) ARCH='x64';; \
#    ppc64el) ARCH='ppc64le';; \
#    s390x) ARCH='s390x';; \
#    arm64) ARCH='arm64';; \
#    armhf) ARCH='armv7l';; \
#    i386) ARCH='x86';; \
#    *) echo "unsupported architecture"; exit 1 ;; \
#  esac \
#  # gpg keys listed at https://github.com/nodejs/node#release-keys
#  && set -ex \
#  && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION_THEIA/node-v$NODE_VERSION-linux-$ARCH.tar.xz" \
#  && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION_THEIA/SHASUMS256.txt.asc" \
#  && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
#  && grep " node-v$NODE_VERSION_THEIA-linux-$ARCH.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
#  && tar -xJf "node-v$NODE_VERSION_THEIA-linux-$ARCH.tar.xz" -C /cdtcloud/node-theia --strip-components=1 --no-same-owner \
#  && rm "node-v$NODE_VERSION_THEIA-linux-$ARCH.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
#  && ln -s /cdtcloud/node-theia/bin/node /usr/local/bin/node-v$NODE_VERSION_THEIA \
#  # smoke tests
#  && node-v$NODE_VERSION_THEIA --version
#
## Install yarn for theia
#RUN set -ex \
#  && curl -fsSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION_THEIA/yarn-v$YARN_VERSION_THEIA.tar.gz" \
#  && curl -fsSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION_THEIA/yarn-v$YARN_VERSION_THEIA.tar.gz.asc" \
#  && gpg --batch --verify yarn-v$YARN_VERSION_THEIA.tar.gz.asc yarn-v$YARN_VERSION_THEIA.tar.gz \
#  && tar -xzf yarn-v$YARN_VERSION_THEIA.tar.gz -C /opt/ \
#  && ln -s /opt/yarn-v$YARN_VERSION_THEIA/bin/yarn /usr/local/bin/yarn-v$YARN_VERSION_THEIA \
#  && ln -s /opt/yarn-v$YARN_VERSION_THEIA/bin/yarnpkg /usr/local/bin/yarnpkg-v$YARN_VERSION_THEIA \
#  && rm yarn-v$YARN_VERSION_THEIA.tar.gz.asc yarn-v$YARN_VERSION_THEIA.tar.gz \
#  # smoke test
#  && yarn-$YARN_VERSION_THEIA --version

FROM base as demo
ARG DOCKER_USER
ARG ARDUINO_VERSION
ARG NODE_VERSION_THEIA
ARG YARN_VERSION_THEIA=1.22.5

LABEL description="CdtCloud demo image"

ENV SHELL=/bin/bash
ENV NODE_ENV=demo

COPY --from=arduino-cli /usr/local/bin/arduino-cli /usr/local/bin/arduino-cli
COPY --from=arduino-cli --chown=$DOCKER_USER:$DOCKER_USER /home/$DOCKER_USER/.arduino15 /home/$DOCKER_USER/.arduino15
COPY --from=deployment-server --chown=$DOCKER_USER:$DOCKER_USER /cdtcloud/deployment-server/ /cdtcloud/deployment-server/
COPY --from=deployment-server --chown=$DOCKER_USER:$DOCKER_USER /cdtcloud/public/ /cdtcloud/public/
COPY --from=device-connector --chown=$DOCKER_USER:$DOCKER_USER /cdtcloud/device-connector/ /cdtcloud/device-connector/
COPY --from=device-connector --chown=$DOCKER_USER:$DOCKER_USER /cdtcloud/grpc/ /cdtcloud/grpc/
COPY --from=cdtcloud-theia --chown=$DOCKER_USER:$DOCKER_USER /cdtcloud/theia/ /cdtcloud/theia/

RUN sudo yarn global add concurrently --prefix /usr/local

EXPOSE 3000
EXPOSE 3001

CMD ["dumb-init", "concurrently", "--restart-tries", "-1", "-n", "arduino-cli,deployment-server,device-connector,theia", "arduino-cli daemon --port 50051 --daemonize --no-color --verbose", "yarn --cwd=deployment-server start", "yarn --cwd=device-connector start", "yarn --cwd=theia/packages/theia-extension/browser-app/src-gen/backend/main.js start --hostname=0.0.0.0"]
