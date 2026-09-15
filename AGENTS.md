# AGENTS.md

## Cursor Cloud specific instructions

### What this repo is
`codex-universal` builds a single Docker base image (`Dockerfile`) that bundles many
language runtimes (Python, Node, Bun, Rust, Go, Java, Swift, Ruby, PHP, Elixir/Erlang).
There is no long-running app or dev server. The "application" is the image itself, plus
three shell scripts baked into it: `setup_universal.sh` (switches runtime versions from
`CODEX_ENV_*` env vars), `entrypoint.sh` (runs setup, then drops into a login shell), and
`verify.sh` (asserts every runtime is present — the repo's built-in test).

### Docker is required and is NOT auto-started
All build/run/test work goes through Docker. The daemon is not started automatically on
boot; start it once per session before doing anything (it keeps running in the background):

```
sudo dockerd 2>&1 | tee /tmp/dockerd.log &
```

Gotchas discovered during setup:
- The VM runs Docker 29 with the `fuse-overlayfs` storage driver. `/etc/docker/daemon.json`
  MUST disable the containerd snapshotter or the daemon fails to start:
  `{"storage-driver":"fuse-overlayfs","features":{"containerd-snapshotter":false}}`.
- `iptables`/`ip6tables` must be set to the `-legacy` alternatives for container networking.

### Lint
There is no configured linter. The relevant check is `shellcheck *.sh`
(`setup_universal.sh`, `verify.sh`, `entrypoint.sh` are all clean).

### Building the image (heads-up: strict apt pins drift)
```
sudo docker build --platform linux/amd64 -t codex-universal:dev .
```
This compiles many toolchains from source and takes a very long time. The `Dockerfile`
pins exact apt package versions (e.g. `tzdata=2026a-*`); these drift as the Ubuntu archive
moves (observed: archive shipped `tzdata 2026b`, so the pinned `2026a-*` failed on the very
first `apt-get install` step). A full local build may require bumping stale pins — this is a
repo-maintenance concern, not an environment problem.

### Fast way to run/test without a full rebuild
Pull and use the published image, which contains the same scripts:
```
sudo docker pull ghcr.io/openai/codex-universal:latest
```
- Run version-switching + a program:
  `docker run --rm -e CODEX_ENV_PYTHON_VERSION=3.12.13 -e CODEX_ENV_NODE_VERSION=20 ghcr.io/openai/codex-universal:latest -c 'python3 --version; node --version'`
  (default entrypoint runs `setup_universal.sh`, then `bash --login "$@"`).
- Run the full verification test: `verify.sh` expects `*_VERSIONS` env vars
  (`PYTHON_VERSIONS`, `NODE_VERSIONS`, `RUST_VERSIONS`, `GO_VERSIONS`, `SWIFT_VERSIONS`,
  `RUBY_VERSIONS`, `PHP_VERSIONS`, `JAVA_VERSIONS`) whose values must match versions actually
  installed in the image (check with `pyenv versions`, `nvm ls`, etc.).
- The published `latest` image can carry different runtime patch versions than the current
  `Dockerfile` pins, and `setup_universal.sh` uses `set -e`, so requesting a version that
  isn't installed aborts the script. Confirm installed versions first.
- The three scripts are mode `644` in git (the `Dockerfile` `chmod +x`es them after `COPY`).
  When mounting the repo into a container, invoke them via `bash script.sh` or `source`,
  not `./script.sh`.
