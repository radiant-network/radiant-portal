# radiant-client

Command-line download of case documents from a Radiant API, from a TSV manifest. Replaces the
ferload client: same two commands, Keycloak device flow instead of a client secret.

Binaries for Linux, macOS and Windows are attached to each GitHub release
(`radiant-client-<os>-<arch>.tar.gz` / `.zip`, `checksums.txt`).

## Configure (once per machine)

```sh
radiant-client configure -u https://api.example.org
```

Fetches the public `GET /config` of the API (Keycloak URL, realm, public client id) and saves it to
`~/.config/radiant-client/config.json` (Linux), `~/Library/Application Support/radiant-client/config.json`
(macOS) or `%AppData%\radiant-client\config.json` (Windows). Override the path with `--config` or
`RADIANT_CLIENT_CONFIG`. `--reset` wipes the settings and the stored tokens.

## Download

```sh
radiant-client download -m manifest.tsv -o ./downloads
```

| Flag | Default | Effect |
|---|---|---|
| `-m, --manifest` | required | TSV manifest |
| `-o, --output` | `.` | output directory, created if missing |
| `-t, --threads` | 4 | parallel downloads (each worker presigns then downloads one document) |
| `-y, --yes` | | skip the size / disk space confirmation |
| `--resume` | | skip files already complete on disk, continue partial `.part` files with HTTP Range |
| `--skip-missing` | | exit 0 even when some documents were not found or not allowed |

First run opens the Keycloak device flow: the CLI prints a URL and a code, you log in from any
browser, the CLI continues by itself. Tokens are stored (mode 0600) and refreshed silently on the
next runs.

### Manifest

Tab separated, header row, column names case insensitive:

```
tenant	document_id	name	size
qlin	4821	SP0001234.cram	31 GB
qlin	4822	SP0001234.cram.crai
qlin	4835	SP0001234.vcf.gz	412 MB
```

`tenant` and `document_id` are required. `name` defaults to the object name in the storage URL.
`size` (`123`, `1.5 GB`, `512 MiB`) feeds the total shown before the confirmation and the disk
space check; rows without it are counted but not included in that total.

Only an unusable file stops the run (empty, a required column missing, no valid row). Anything
odd is printed as a `warning:` under the manifest summary and the row is skipped: unknown column,
row without `document_id`, invalid id, missing tenant, duplicate id (first one wins). An invalid
`size` keeps the row with an unknown size.

Two different documents resolving to the same file name (explicit `name`, or the same object name
under different storage prefixes) cannot both be written: the second one is reported as `ignored:`
with both document ids and nothing is written for it. Give them distinct `name` values.

### Colors

Progress bars and ANSI colors are only used when the output is an interactive terminal. Piped or
redirected output gets plain text, one line per finished file. Set `NO_COLOR` (or `TERM=dumb`) to
force plain text on a terminal.

### Interrupting

Ctrl-C (or SIGTERM) stops cleanly: queued files are not started, in-flight transfers are aborted
and their `.part` files kept, completed files are untouched. The summary counts them as
interrupted and the run exits with code 130. Run again with `--resume` to continue where it
stopped. A second Ctrl-C force-quits.

### Exit codes

`0` everything downloaded (or skipped), `1` any failure, any document not found / not allowed
(unless `--skip-missing`), a rejected session (tokens are cleared, run again), or a refused
confirmation. `130` interrupted by the user.

## Build

```sh
make build-cli       # bin/radiant-client/radiant-client, version from `git describe`
make build-cli-all   # dist/*.tar.gz, *.zip, checksums.txt
make test-cli
```
