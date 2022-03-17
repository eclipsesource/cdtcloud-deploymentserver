/********************************************************************************
    Copyright (c) 2022 EclipseSource and others.

    This program and the accompanying materials are made available under the
    terms of the Eclipse Public License v. 2.0 which is available at
    http://www.eclipse.org/legal/epl-2.0.

    This Source Code may also be made available under the following Secondary
    Licenses when the conditions for such availability set forth in the Eclipse
    Public License v. 2.0 are satisfied: GNU General Public License, version 2
    with the GNU Classpath Exception which is available at
    https://www.gnu.org/software/classpath/license.html.

    SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
********************************************************************************/

import prismaClient from '@prisma/client'

const { PrismaClient } = prismaClient
const prisma = new PrismaClient()

const deviceTypes = [
  { name: 'Arduino BT', fqbn: 'arduino:avr:bt', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_bt07_breadboard.svg', store: 'https://docs.arduino.cc/retired/boards/arduino-BT#summary' },
  { name: 'Arduino Esplora', fqbn: 'arduino:avr:esplora', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_Esplora_breadboard.svg', store: 'https://www.arduino.cc/en/Main.ArduinoBoardEsplora' },
  { name: 'Arduino Ethernet', fqbn: 'arduino:avr:ethernet', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/develop/svg/core/breadboard/Arduino-Ethernet-v11_breadboard.svg', store: 'https://docs.arduino.cc/retired/boards/arduino-ethernet-rev3-without-poe' },
  { name: 'Arduino Fio', fqbn: 'arduino:avr:fio', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino-Fio-v22_breadboard.svg', store: 'https://www.arduino.cc/en/pmwiki.php?n=Main/ArduinoBoardFio' },
  { name: 'Arduino Leonardo', fqbn: 'arduino:avr:leonardo', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_Leonardo_Rev3_breadboard.svg', store: 'https://www.arduino.cc/en/Main/Arduino_BoardLeonardo' },
  { name: 'Arduino Leonardo ETH', fqbn: 'arduino:avr:leonardoeth', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_Leonardo_Rev3_breadboard.svg', store: 'https://docs.arduino.cc/retired/boards/arduino-leonardo-eth' },
  { name: 'Arduino Mega ADK', fqbn: 'arduino:avr:megaADK', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_ADK_MEGA_2560-Rev3_breadboard.svg', store: 'https://docs.arduino.cc/retired/boards/arduino-mega-adk-rev3' },
  { name: 'Arduino Mega or Mega 2560', fqbn: 'arduino:avr:mega', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_MEGA_2560-Rev3_breadboard.svg', store: 'https://docs.arduino.cc/hardware/mega-2560' },
  { name: 'Arduino Micro', fqbn: 'arduino:avr:micro', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_Micro_Rev03_breadboard.svg', store: 'https://docs.arduino.cc/hardware/micro' },
  { name: 'Arduino Mini', fqbn: ' arduino:avr:mini', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/arduino_mini_usb_adapter.svg', store: 'https://www.arduino.cc/en/pmwiki.php?n=Main/ArduinoBoardProMini' },
  { name: 'Arduino Nano', fqbn: ' arduino:avr:nano', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino%20Nano3_breadboard.svg', store: 'https://docs.arduino.cc/hardware/nano' },
  { name: 'Arduino Pro or Pro Mini', fqbn: 'arduino:avr:pro', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino-Pro-Mini_breadboard.svg', store: 'https://docs.arduino.cc/retired/boards/arduino-pro' },
  { name: 'Arduino Uno', fqbn: 'arduino:avr:uno', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/arduino_Uno_Rev3_breadboard.svg', store: 'https://docs.arduino.cc/hardware/uno-rev3' },
  { name: 'Arduino Uno WiFi', fqbn: 'arduino:avr:unowifi', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/arduino_uno(rev3)-icsp_breadboard.svg', store: 'https://docs.arduino.cc/hardware/uno-wifi-rev2' },
  { name: 'Arduino Yún', fqbn: 'arduino:avr:yun', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/arduino_Yun(rev1)_breadboard.svg', store: 'https://docs.arduino.cc/retired/boards/arduino-yun' },
  { name: 'LilyPad Arduino', fqbn: 'arduino:avr:lilypad', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/LilyPad_Arduino_USB_breadboard.svg', store: 'https://docs.arduino.cc/retired/boards/lilypad-arduino-main-board' },
  { name: 'LilyPad Arduino USB', fqbn: 'arduino:avr:LilyPadUSB', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/LilyPad_Arduino_USB_breadboard.svg', store: 'https://docs.arduino.cc/retired/boards/lilypad-arduino-usb' },
  { name: 'Linino One', fqbn: 'arduino:avr:one', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/linino_one(rev1)_breadboard.svg', store: 'https://docs.platformio.org/en/stable/boards/atmelavr/one.html' },
  { name: 'Arduino Due (Programming Port)', fqbn: 'arduino:sam:arduino_due_x_dbg', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_DUE_V02b_breadboard.svg', store: 'https://docs.arduino.cc/hardware/due' },
  { name: 'Arduino Due (Native USB Port)', fqbn: 'arduino:sam:arduino_due_x', image: 'https://raw.githubusercontent.com/fritzing/fritzing-parts/main/svg/core/breadboard/Arduino_DUE_V02b_breadboard.svg', store: 'https://docs.arduino.cc/hardware/due' }
]

try {
  await prisma.$connect()
  await prisma.deviceType.deleteMany()
  await prisma.deviceType.createMany({ data: deviceTypes })
} finally {
  await prisma.$disconnect()
}
