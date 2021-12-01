export type ArduinoPort = {
    address: string,
    label: string,
    protocol: string
}

export type Device = {
    name: string,
    serialNumber: string,
    fqbn: string,
    hidden: boolean,
    platform: string,
    port: ArduinoPort
}
