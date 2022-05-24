# Theia Extension

[![arduino-cli](https://img.shields.io/badge/arduino--cli-0.20.0-00979C?logo=arduino)](https://github.com/arduino/arduino-cli/releases/tag/0.20.0)
[![docker](https://img.shields.io/badge/Docker-Support-2496ED?logo=docker)](https://docker.com/)

To configure the deployment server, set:

```
DEPLOYMENT_SERVER_HOST=localhost:3001 DEPLOYMENT_SERVER_SECURE=false
```

## Introduction

## Requirements

## Getting Started

### Quick Start

### Docker


### Adding support for additional devices

More devices or cores can be supported by installing them through the Arduino CLI.
<br/>
This needs to be done in the [Device Connector](../device-connector) as well.

> It is possible that the code needs to be slightly adjusted to be able to select the correct output file.
> <details><summary>Code</summary>
> https://github.com/eclipsesource/cdtcloud-deploymentserver/blob/a09070cfaec74d6be5ef1e12a2aaa37b5e684141/packages/theia-extension/cdtcloud/src/node/compilation-service.ts#L55-L86
> </details>

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
