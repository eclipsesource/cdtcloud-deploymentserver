# Deployment-Server

[![node](https://img.shields.io/badge/node-%3E%3D%2016.5.0-success)](https://nodejs.org/en/blog/release/v16.5.0/)

1. Install docker-compose
2. Run `docker-compose up db`
3. Install dependencies: `yarn install`
4. Run database migration once to initialize: `yarn --cwd=packages/deployment-server run prisma migrate deploy`
5. Generate DB Typings: `yarn --cwd=packages/deployment-server run prisma generate`
6. Seed DB: `yarn --cwd=packages/deployment-server run prisma db seed`
7. Start the server: `yarn --cwd=packages/deployment-server run dev`

#### GCS support

1. Set env variables

```
GOOGLE_CLOUD_PROJECT
GOOGLE_CLOUD_BUCKET
```

2. Add a `.gcs_key.json` in `packages/deployment-server`

3. Run the deployment server
