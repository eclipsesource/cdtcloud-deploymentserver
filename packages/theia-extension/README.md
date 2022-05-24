# Theia Extension

[![arduino-cli](https://img.shields.io/badge/arduino--cli-0.20.0-00979C?logo=arduino)](https://github.com/arduino/arduino-cli/releases/tag/0.20.0)
[![docker](https://img.shields.io/badge/Docker-Support-2496ED?logo=docker)](#Docker)

## Introduction

The Theia Extension provides a Widget to deploy and monitor code remotely on devices using the well-known Theia IDE Environment.

It compiles the code and sends a deployment request, including the binary data, for a specific device to the [Deployment Server](../deployment-server), which forwards the request to the responsible [Device Connector](../device-connector) and transfers the monitoring output back to the Theia Extension.

## Requirements

- Arduino CLI >= 0.20.0 (last tested 0.21.1)

## Getting Started

To have an easy installation and start of the CDT.cloud Services run the `./cdtcloud` script from the root directory.
<br/>
You can either run Theia [natively](#Quick-Start) on your system or in a [Docker](#Docker) container.

### Quick Start

The [Arduino CLI](https://github.com/arduino/arduino-cli/releases) needs to be running on startup.
<br/>
Start the daemon with `arduino-cli daemon --port 50051 --daemonize`

#### First Installation
1. Initialize the Arduino CLI by running `arduino-cli config init`
2. Update the core and library indexes with `arduino-cli update`
3. Install the base cores by entering `arduino-cli core install arduino:avr`
4. Install the dependencies using `yarn --cwd=cdtcloud`
5. Build Theia either for 
   - Browser `yarn --cwd=browser-app run theia build --mode=production` 
   - Electron `yarn --cwd=electron-app run theia build --mode=production`
6. Download the necessary plugins by running `yarn --cwd=cdtcloud theia download:plugins` 

#### Run the CDT.cloud Imlpementation in Theia 

- Run Theia in either in 
  - Browser using `yarn --cwd=browser-app start` and enter Theia by heading to [http://localhost:3000](http://localhost:3000)
  - Electron using `yarn --cwd=electron-app start`
- Select _View_ > _Cdtcloud Widget_ to open the extension widget

### Docker

1. Run the `./cdtcloud` script from the root directory
2. Select `docker` to run the docker tools
3. Enter the command `start:theia:d` to start the service
4. You can use the `docker` section to attach and kill containers as well
5. Head to [http://localhost:3000](http://localhost:3000) to enter Theia
6. Select _View_ > _Cdtcloud Widget_ to open the extension widget


### Configuration

1. Head to Theia and choose _File_ > _Preferences_ > _Open Settings_
2. Select the _Extensions_ Tab
3. Set the correct variables for the connection to the Deployment Server

### Adding support for additional devices

More devices or cores can be supported by installing them through the Arduino CLI.
<br/>
This needs to be done in the [Device Connector](../device-connector) as well.

> It is possible that the [code](https://github.com/eclipsesource/cdtcloud-deploymentserver/blob/a09070cfaec74d6be5ef1e12a2aaa37b5e684141/packages/theia-extension/cdtcloud/src/node/compilation-service.ts#L55-L86) needs to be slightly adjusted to be able to select the correct output file.

A new core support can be installed within the Arduion CLI by running the following commands:
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
