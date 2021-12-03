import prismaClient from '@prisma/client'

const { PrismaClient } = prismaClient
const prisma = new PrismaClient()

const boards = [
  { name: 'Adafruit Circuit Playground', fqbn: 'arduino:avr:circuitplay32u4cat' },
  { name: 'Arduino BT', fqbn: 'arduino:avr:bt' },
  { name: 'Arduino Duemilanove or Diecimila', fqbn: 'arduino:avr:diecimila' },
  { name: 'Arduino Esplora', fqbn: 'arduino:avr:esplora' },
  { name: 'Arduino Ethernet', fqbn: 'arduino:avr:ethernet' },
  { name: 'Arduino Fio', fqbn: 'arduino:avr:fio' },
  { name: 'Arduino Gemma', fqbn: 'arduino:avr:gemma' },
  { name: 'Arduino Industrial 101', fqbn: 'arduino:avr:chiwawa' },
  { name: 'Arduino Leonardo', fqbn: 'arduino:avr:leonardo' },
  { name: 'Arduino Leonardo ETH', fqbn: 'arduino:avr:leonardoeth' },
  { name: 'Arduino Mega ADK', fqbn: 'arduino:avr:megaADK' },
  { name: 'Arduino Mega or Mega 2560', fqbn: 'arduino:avr:mega' },
  { name: 'Arduino Micro', fqbn: 'arduino:avr:micro' },
  { name: 'Arduino Mini', fqbn: ' arduino:avr:mini' },
  { name: 'Arduino NG or older', fqbn: 'arduino:avr:atmegang' },
  { name: 'Arduino Nano', fqbn: ' arduino:avr:nano' },
  { name: 'Arduino Pro or Pro Mini', fqbn: 'arduino:avr:pro' },
  { name: 'Arduino Robot Control', fqbn: 'arduino:avr:robotControl' },
  { name: 'Arduino Robot Motor', fqbn: 'arduino:avr:robotMotor' },
  { name: 'Arduino Uno', fqbn: 'arduino:avr:uno' },
  { name: 'Arduino Uno WiFi', fqbn: 'arduino:avr:unowifi' },
  { name: 'Arduino Yún', fqbn: 'arduino:avr:yun' },
  { name: 'Arduino Yún Mini', fqbn: 'arduino:avr:yunmini' },
  { name: 'LilyPad Arduino', fqbn: 'arduino:avr:lilypad' },
  { name: 'LilyPad Arduino USB', fqbn: 'arduino:avr:LilyPadUSB' },
  { name: 'Linino One', fqbn: 'arduino:avr:one' }
]

try {
  await prisma.$connect()
  await prisma.deviceType.createMany({ data: boards })
} finally {
  await prisma.$disconnect()
}
