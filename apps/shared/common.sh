PATH_APPS="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../" && pwd )"
PATH_SHARED="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$PATH_SHARED/defines.sh"

source "$PATH_SHARED/deno.sh"

CDTCLOUD_VERSION="$(cat "$PATH_ROOT/package.json" | grep -m 1 version | sed 's/[^0-9.]//g')"

denoInstall