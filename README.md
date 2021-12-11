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

1. Start arduino-cli daemon:
   - a) With Docker:
     - Run `docker-compose up arduino`
   - b) Manually:
     - Download the arduino-cli v0.20.0 from [arduino-cli releases](https://github.com/arduino/arduino-cli/releases/tag/0.20.0)
     - Run: `arduino-cli daemon --port 50051 --daemonize`
2. Install dependencies: `yarn install`
3. Make sure the deployment server is running
4. Start the device connector: `yarn --cwd=packages/device-connector run dev`

#### Edit configuration (optional)
You can use the `packages/device-connector/.env` file to edit the node_env environment and deployment server uri