import { Connector, Device } from '@prisma/client'

export type DeviceWithConnector = Device & { connector: Connector }

export type { Device }
