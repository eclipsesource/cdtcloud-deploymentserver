# Deployment Server

[![node](https://img.shields.io/badge/node-%3E%3D%2016.5.0-339933?logo=node.js)](https://nodejs.org/en/blog/release/v16.5.0/)
[![psql](https://img.shields.io/badge/PostgreSQL-v14.3-008bb9?logo=postgresql&logoColor=008bb9)](https://www.postgresql.org/)
[![docker](https://img.shields.io/badge/Docker-Support-2496ED?logo=docker)](https://docker.com/)

## Introduction

The Deployment Server is responsible for the communication between the [Device Connectors](../device-connector) and the [Theia Extension](../theia-extension).

It manages the hardware and distributes the deployments among the connected devices, forwarding the request to the responsible Device Connector. Finally, the Deployment Server also forwards any monitoring output back to Theia and, if necessary, the AdminUI.

The Deployment Server also provides an AdminUI under (by default) [http://localhost:3001](http://localhost:3001).

## Requirements

- NodeJS Version >= 16.5.0
- Yarn Version >= 1.22.18
- PostgreSQL Server >= 14.3

## Getting Started

To have an easy installation and start of the CDT.cloud Services run the `./cdtcloud` script from the root directory.
<br/>
You can either run the Deployment Server [natively](#Quick-Start) on your system or in a [Docker](#Docker) container.

### Quick Start

A PostgreSQL Server needs to be running. It can run natively on the system or using Docker (`docker-compose up db` in the root directory).

#### First Installation

1. Install the dependencies using `yarn install`
2. On the first installation, initialize the database with `yarn run prisma migrate deploy`
3. Generate DB Typings by running `yarn run prisma generate`
4. To then seed the DB run `yarn run prisma db seed`

#### Run the Deployment Server

Run the server with `yarn run start`

### Docker

1. Run the `./cdtcloud` script from the root directory
2. Select *docker* to run the docker tools
3. Enter the command `start:deployment:d` to start the server
4. You can use the *docker* section to attach and kill containers as well

### Configuration

- Edit the **env** variables to adjust *Host*, *Database* and *Environment*

#### GCS support

- Add and set the following **env** variables
```
GOOGLE_CLOUD_PROJECT
GOOGLE_CLOUD_BUCKET
```
- Add a `.gcs_key.json` in `packages/deployment-server`

#### Cloudflare support

Cloudflare is supported but will cause issues with the Websockets, as Cloudflare restricts WS-Connections to only 100 seconds. Therefore the Websockets will reconnect every 100 seconds.

#### Reverse Proxies

To support all features using a reverse proxy, certain configurations need to be made within the webserver.
<br/>
Upgrade Headers need to be added and as usual the proxy_forward headers should be set.

<details>
<summary>Nginx Configuration Example</summary>

```conf
server {
        listen 80;
        listen [::]:80;
        server_name domain.tld;

        access_log /var/log/nginx/reverse-access.log;
        error_log /var/log/nginx/reverse-error.log;

        location / {
                    proxy_pass http://127.0.0.1:3001;
                    proxy_http_version  1.1;
                    proxy_cache_bypass  $http_upgrade;

                    proxy_set_header Host              $host;
                    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
                    proxy_set_header X-Real-IP         $remote_addr;
                    proxy_set_header X-Forwarded-Host  $host;
                    proxy_set_header X-Forwarded-Port  $server_port;

                    ## Add this in case of using TLS, forwarding from an encrypted connection or Cloudflare
                    # proxy_set_header X-Forwarded-Proto https;

                    # Websocket Support
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection "upgrade";
  }
}
```
</details>

## License

This code and content is released under the [EPL 2.0 license](https://github.com/eclipsesource/cdtcloud-deploymentserver/blob/main/LICENSE).
