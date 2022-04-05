#!/usr/bin/env bash

CURRENT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$CURRENT_PATH/../shared/common.sh"

source "$CURRENT_PATH/includes/functions.sh"

PS3='[Please enter your choice]: '
options=(
  "init (i): First Installation"     # 1
  "install-deps (d): install deps"   # 2
  "Import DB (db): Update/Import DB" # 3
  "run cdtcloud demo (rd): Run demo" # 4
  "docker (dr): Run docker tools"    # 5
  "quit (q): Exit from this menu"    # 6
)

function _switch() {
  _reply="$1"

  case $_reply in
  "" | "i" | "init" | "1")
    init_all
    ;;
  "" | "d" | "install-deps" | "2")
    install_deps
    ;;
  "" | "db" | "db-import" | "3")
    import_db
    ;;
  "" | "rd" | "run-demo" | "4")
    yarn start:demo
    ;;
  "" | "dr" | "docker" | "5")
    DOCKER=1 denoRunFile "$PATH_APPS/docker/docker.ts" "${@:2}"
    exit
    ;;
  "" | "q" | "quit" | "6")
    echo "Goodbye!"
    exit
    ;;
  "" | "h" | "--help")
    echo "Available commands:"
    printf '%s\n' "${options[@]}"
    ;;
  *) echo "invalid option, use --help option for the commands list" ;;
  esac
}

while true; do
  [ ! -z $1 ] && _switch $@
  [ ! -z $1 ] && exit 0

  echo "==== CdtCloud ===="
  select opt in "${options[@]}"; do
    _switch $REPLY
    break
  done
done
