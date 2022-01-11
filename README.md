# cdtcloud-deploymentserver
[![CI](https://github.com/eclipsesource/cdtcloud-deploymentserver/actions/workflows/ci.yaml/badge.svg)](https://github.com/eclipsesource/cdtcloud-deploymentserver/actions/workflows/ci.yaml)

## Getting Started

### Deployment Server

1. Install docker-compose
2. Run `docker-compose up db`
3. Install dependencies: `yarn install`
4. Run database migration once to initialize: `yarn --cwd=packages/deployment-server run prisma migrate deploy`
5. Generate DB Typings: `yarn --cwd=packages/deployment-server run prisma generate`
6. Seed DB: `yarn --cwd=packages/deployment-server run prisma db seed`
7. Start the server: `yarn --cwd=packages/deployment-server run dev`

### Device Connector

#### With Docker
1. Set deployment-server URI in [.docker/device-connector/env](.docker/device-connector/env)
2. Run the device-connector: `docker-compose up devcon`
   - Build the docker-image beforehand if necessary `docker-compose build`

#### On System
1. Download the latest supported arduino-cli version _(currently v0.20.0)_ from [arduino-cli releases](https://github.com/arduino/arduino-cli/releases/tag/0.20.0)
2. Start the arduino-cli daemon: `arduino-cli daemon --port 50051 --daemonize --verbose`
3. Install dependencies: `yarn install`
4. Set deployment-server URI in [packages/device-connector/.env](packages/device-connector/.env)
5. Start the device connector: `yarn --cwd=packages/device-connector run start`
