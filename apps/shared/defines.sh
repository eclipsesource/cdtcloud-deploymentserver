PATH_ROOT=$(readlink -f "$PATH_APPS/../")

case $PATH_ROOT in
  /*) PATH_ROOT=$PATH_ROOT;;
  *) PATH_ROOT=$PWD/$PATH_ROOT;;
esac

PATH_DEPS="$PATH_ROOT/deps"
