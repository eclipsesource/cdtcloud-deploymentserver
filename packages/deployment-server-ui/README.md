# Deployment Server

[![node](https://img.shields.io/badge/node-%3E%3D%2016.5.0-339933?logo=node.js)](https://nodejs.org/en/blog/release/v16.5.0/)

## Introduction

The AdminUI is part of the [Deployment Server](../deployment-server) and represents the frontend for administrators.

It is used to monitor and manage connected devices and deployments. It also gives overall statistics for deployments over time and specific device type usages.

The AdminUI is by default available under [localhost:3001](http://localhost:3001).

## Requirements

- NodeJS Version >= 16.5.0
- Yarn Version >= 1.22.18

## Getting Started

This Guide is only meant for users running the Deployment Server natively. It is not needed if it is run inside a Docker container.

### Quick Start

1. Install the dependencies using `yarn install`
2. Build the AdminUI by running `yarn run vite build` 
3. Copy the compiled sources to the target [public folder](../deployment-server/public) with `cp -r dist/* ../deployment-server/public/`
4. Head to [localhost:3001](http://localhost:3001) after running the [Deployment Server](../deployment-server)

## License

This code and content is released under the [EPL 2.0 license](https://github.com/eclipsesource/cdtcloud-deploymentserver/blob/main/LICENSE).
