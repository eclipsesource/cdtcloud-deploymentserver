
# Device Connector

[![node](https://img.shields.io/badge/node-%3E%3D%2016.5.0-339933?logo=node.js)](https://nodejs.org/en/blog/release/v16.5.0/)
[![arduino-cli](https://img.shields.io/badge/arduino--cli-0.20.0-00979C?logo=arduino)](https://github.com/arduino/arduino-cli/releases/tag/0.20.0)
[![docker](https://img.shields.io/badge/Docker-Support-2496ED?logo=docker)](#Docker)

## Introduction

The Device Connector is responsible for the management of the individual devices connected to a machine. 

Having an own Service for the management of the connected devices on a machine, allows having any number of machines distributed over different locations. This way a user or administrator is not restricted to a single machine and limited number of ports for their devices.

The Device Connector establishes a connection to the [Deployment Server](../deployment-server), keeping it up to date to the currently available devices as well as running deployments and forwarding the output of thus deployments if necessary.

## Requirements

- NodeJS Version >= 16.5.0
- Yarn Version >= 1.22.18
- Arduino CLI >= 0.20.0 (last tested 0.21.1)

## Getting Started

To have an easy installation and start of the CDT.cloud Services run the `./cdtcloud` script from the root directory.
<br/>
You can either run the Device Connector [natively](#Quick-Start) on your system or in a [Docker](#Docker) container.

### Quick Start

The [Arduino CLI](https://github.com/arduino/arduino-cli/releases) needs to be running on startup.
<br/>
Start the daemon with `arduino-cli daemon --port 50051 --daemonize`

#### First Installation
1. Initialize the Arduino CLI by running `arduino-cli config init`
2. Update the core and library indexes with `arduino-cli update`
3. Install the base cores by entering `arduino-cli core install arduino:avr`
4. Install the dependencies using `yarn install`
5. Set the **env** variables for the Deployment Server Connection (you can use the [.env](.env) file)

#### Run the Device Connector

Run the Device Connector using `yarn run start`

### Docker

> Due to docker not supporting privileged mode on Windows, this does only work on unix systems.

1. Set the **env** variables for the Deployment Server Connection (you can use the [Docker env](../../.docker/device-connector/env) file)
2. Run the `./cdtcloud` script from the root directory
3. Select _docker_ to run the docker tools
4. Enter the command `start:connector:d` to start the service
5. You can use the _docker_ section to attach and kill containers as well

### Adding support for additional devices

More devices or cores can be supported by installing them through the Arduino CLI.
<br/>
This needs to be done in the [Theia Extension](../theia-extension) as well.
<br/>
To do so run the following commands:
```bash
arduino-cli core update-index
arduino-cli core install base:core
```

#### External Cores - i.e. STM32 Board-Core
```bash
arduino-cli config add board_manager.additional_urls https://github.com/stm32duino/BoardManagerFiles/raw/main/package_stmicroelectronics_index.json
arduino-cli core update-index
arduino-cli core install STMicroelectronics:stm32
```

## License

This code and content is released under the [EPL 2.0 license](https://github.com/eclipsesource/cdtcloud-deploymentserver/blob/main/LICENSE).
