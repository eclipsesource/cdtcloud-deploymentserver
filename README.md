# cdtcloud-deploymentserver

## Getting Started

### Deployment Server

1. Install docker-compose
2. Run `docker-compose up`
3. Install dependencies: `yarn install`
4. Run database migration once to initialize: `yarn --cwd=packages/deployment-server run prisma migrate deploy`
5. Generate DB Typings: `yarn --cwd=packages/deployment-server run prisma generate`
6. Seed DB: `yarn --cwd=packages/deployment-server run prisma db seed`
7. Start the server: `yarn --cwd=packages/deployment-server run dev`
