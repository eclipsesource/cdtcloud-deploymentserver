DENO_MIN_VERSION="1.9.1"

function denoInstall() {

    { # try
        echo "Deno version check:" && denoCmd upgrade --version $DENO_MIN_VERSION
    } ||
    { # catch
        echo "Installing Deno..."
        # just one line of command that works on all OSes
        # (temporary cd into PATH_DEPS)
        curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL="$PATH_DEPS/deno" sh
    }
}

function denoCmd() {
    [[ "$OSTYPE" = "msys" ]] && DENOEXEC="./deps/deno/bin/deno.exe" || DENOEXEC="./deps/deno/bin/deno"
    (cd "$PATH_ROOT" ; $DENOEXEC "$@")
}

function denoRunFile() {
    denoCmd run --allow-all --unstable "$@"
}
