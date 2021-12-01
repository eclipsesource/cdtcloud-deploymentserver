export interface ArduinoPort {
  address: string
  label: string
  protocol: string
}

export interface Device {
  name: string
  serialNumber: string
  fqbn: string
  hidden: boolean
  platform: string
  port: ArduinoPort
}
