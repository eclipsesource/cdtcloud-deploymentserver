import prismaClient from '@prisma/client'

const { PrismaClient } = prismaClient
const prisma = new PrismaClient()

const boardsWithSVGs = [
  { name: 'Arduino BT', fqbn: 'arduino:avr:bt', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_bt07_breadboard.svg' },
  { name: 'Arduino Esplora', fqbn: 'arduino:avr:esplora', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_Esplora_breadboard.svg' },
  { name: 'Arduino Ethernet', fqbn: 'arduino:avr:ethernet', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/develop/svg/core/breadboard/Arduino-Ethernet-v11_breadboard.svg' },
  { name: 'Arduino Fio', fqbn: 'arduino:avr:fio', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino-Fio-v22_breadboard.svg' },
  { name: 'Arduino Leonardo', fqbn: 'arduino:avr:leonardo', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_Leonardo_Rev3_breadboard.svg' },
  { name: 'Arduino Leonardo ETH', fqbn: 'arduino:avr:leonardoeth', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_Leonardo_Rev3_breadboard.svg' },
  { name: 'Arduino Mega ADK', fqbn: 'arduino:avr:megaADK', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_ADK_MEGA_2560-Rev3_breadboard.svg' },
  { name: 'Arduino Mega or Mega 2560', fqbn: 'arduino:avr:mega', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_MEGA_2560-Rev3_breadboard.svg' },
  { name: 'Arduino Micro', fqbn: 'arduino:avr:micro', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_Micro_Rev03_breadboard.svg' },
  { name: 'Arduino Mini', fqbn: ' arduino:avr:mini', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/arduino_mini_usb_adapter.svg' },
  { name: 'Arduino Nano', fqbn: ' arduino:avr:nano', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino%20Nano3_breadboard.svg'},
  { name: 'Arduino Pro or Pro Mini', fqbn: 'arduino:avr:pro', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino-Pro-Mini_breadboard.svg' },
  { name: 'Arduino Uno', fqbn: 'arduino:avr:uno', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/arduino_Uno_Rev3_breadboard.svg' },
  { name: 'Arduino Uno WiFi', fqbn: 'arduino:avr:unowifi', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/arduino_uno(rev3)-icsp_breadboard.svg' },
  { name: 'Arduino Yún', fqbn: 'arduino:avr:yun', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/arduino_Yun(rev1)_breadboard.svg' },
  { name: 'LilyPad Arduino', fqbn: 'arduino:avr:lilypad', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/LilyPad_Arduino_USB_breadboard.svg' },
  { name: 'LilyPad Arduino USB', fqbn: 'arduino:avr:LilyPadUSB', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/LilyPad_Arduino_USB_breadboard.svg' },
  { name: 'Linino One', fqbn: 'arduino:avr:one', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/linino_one(rev1)_breadboard.svg' },
  { name: 'Arduino Due (Programming Port)', fqbn: 'arduino:sam:arduino_due_x_dbg', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_DUE_V02b_breadboard.svg' },
  { name: 'Arduino Due (Programming Port)', fqbn: 'arduino:sam:arduino_due_x', svg: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_DUE_V02b_breadboard.svg' }
]

try {
  await prisma.$connect()
  await prisma.deviceType.createMany({ data: boardsWithSVGs })
} finally {
  await prisma.$disconnect()
}
