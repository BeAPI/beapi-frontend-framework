#!/bin/bash
function buildTheme {
	cd $1/themes/
	for theme in *; do
	    if [ -d "${theme}" ]; then
	        cd "${theme}" && gulp build && cd ..
	    fi
	done
}
if [ -d "wp-content" ]; then
	buildTheme wp-content
else
	buildTheme content
fi
