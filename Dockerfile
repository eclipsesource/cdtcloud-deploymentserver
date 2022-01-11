FROM node:lts-alpine as fe-builder
WORKDIR /usr/src/app
COPY . .
RUN yarn install --ignore-scripts
RUN yarn --cwd packages/deployment-server-ui run vite build

FROM node:lts-alpine
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
