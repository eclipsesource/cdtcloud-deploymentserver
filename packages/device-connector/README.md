
# Device-Connector

[![node](https://img.shields.io/badge/node-%3E%3D%2016.5.0-success)](https://nodejs.org/en/blog/release/v16.5.0/)
[![arduino-cli](https://img.shields.io/badge/arduino--cli-0.20.0-00979C)](https://github.com/arduino/arduino-cli/releases/tag/0.20.0)
[![docker](https://img.shields.io/badge/Docker-Support-2496ED?logo=docker)](https://docker.com/)

## Introduction

## Requirements

## Getting Started

### Quick Start

### Docker

### With Docker

1. Set deployment-server URI in [.docker/device-connector/env](.docker/device-connector/env)
2. Run the device-connector: `docker-compose up devcon`
    - Build the docker-image beforehand if necessary `docker-compose build`

`Note: Due to docker not supporting privileged mode on Windows, this does only work on unix systems.`

### On System

1. Download the latest supported arduino-cli version _(currently v0.20.0)_ from [arduino-cli releases](https://github.com/arduino/arduino-cli/releases/tag/0.20.0)
2. Start the arduino-cli daemon: `arduino-cli daemon --port 50051 --daemonize --verbose`
3. Install dependencies: `yarn install`
4. Set deployment-server URI in [packages/device-connector/.env](packages/device-connector/.env)
5. Start the device connector: `yarn --cwd=packages/device-connector run start`

#### Add support for additonal boards

STM32 Board-Core

```bash
arduino-cli config add board_manager.additional_urls https://github.com/stm32duino/BoardManagerFiles/raw/main/package_stmicroelectronics_index.json
arduino-cli core update-index
arduino-cli core install STMicroelectronics:stm32
```

Arduino:sam Board-Core

```bash
arduino-cli core update-index
arduino-cli core install arduino:sam
```

## License

This code and content is released under the [EPL 2.0 license](https://github.com/eclipsesource/cdtcloud-deploymentserver/blob/main/LICENSE).
