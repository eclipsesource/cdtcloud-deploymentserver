export interface ArduinoPort {
  address: string
  protocol: string
}

export interface Device {
  name: string
  fqbn: string
  port: ArduinoPort
}
