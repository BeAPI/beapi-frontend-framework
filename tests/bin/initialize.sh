#!/usr/bin/env bash
set -euo pipefail

# Scalar, not an array: bash 3.2 (macOS) treats an empty array expansion as an
# unbound variable under `set -u`.
config_arg=""
for argument in "$@"; do
	case "$argument" in
		--config=*) config_arg="$argument" ;;
	esac
done

run_cli() {
	npx wp-env run cli ${config_arg:+"$config_arg"} -- "$@"
}

run_cli wp theme activate beapi-frontend-framework
run_cli wp plugin activate advanced-custom-fields
