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
                    sudo apt-get -y install build-essential curl git
                    curl -sL https://deb.nodesource.com/setup_17.x | sudo bash -
                    sudo apt -y install nodejs
                    npm install -g yarn
                    yarn
                ;;
                *)
                    echo "$DISTRO, is not supported."
                ;;
            esac
        ;;
        msys*)
          @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
          choco install -y --skip-checksums git git.install nodejs yarn
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
