function install_deps() {
    case "$OSTYPE" in
        linux*)
            # If available, use LSB to identify distribution
            if command -v lsb_release >/dev/null 2>&1 ; then
                DISTRO=$(lsb_release -is)
            # Otherwise, use release info file
            else
                DISTRO=$(ls -d /etc/[A-Za-z]*[_-][rv]e[lr]* | grep -v "lsb" | cut -d'/' -f3 | cut -d'-' -f1 | cut -d'_' -f1)
            fi

            case $DISTRO in
                "neon" | "ubuntu" | "Ubuntu" | "debian" | "Debian")
                    sudo apt-get update
                    sudo apt-get -y install build-essential curl git g++ gcc make python2.7 pkg-config libx11-dev libxkbfile-dev libsecret-1-dev
                    curl -sL https://deb.nodesource.com/setup_17.x | sudo bash -
                    sudo apt -y install nodejs
                    sudo npm install -g yarn
                    curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sudo sh
                    arduino-cli config init || true
                    arduino-cli config add board_manager.additional_urls https://github.com/stm32duino/BoardManagerFiles/raw/main/package_stmicroelectronics_index.json
                    arduino-cli update
                    arduino-cli core install arduino:avr
                    arduino-cli core install arduino:sam
                    arduino-cli core install STMicroelectronics:stm32
                    yarn
                ;;
                *)
                    echo "$DISTRO, is not supported."
                ;;
            esac
        ;;
        msys*)
          @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
          choco install -y --skip-checksums git git.install nodejs yarn arduino-cli
          arduino-cli config init || true
          arduino-cli config add board_manager.additional_urls https://github.com/stm32duino/BoardManagerFiles/raw/main/package_stmicroelectronics_index.json
          arduino-cli update
          arduino-cli core install arduino:avr
          arduino-cli core install arduino:sam
          arduino-cli core install STMicroelectronics:stm32
          yarn
        ;;
        *) echo "This platform is not supported"
        ;;
    esac
}

function import_db() {
    yarn --cwd=packages/deployment-server update:db
}

function build() {
    yarn --cwd=packages/deployment-server-ui build
}

function init_all() {
    install_deps
    import_db
}
