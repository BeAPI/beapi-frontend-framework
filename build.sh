#!/bin/bash
function buildTheme {
	cd $1/themes/
	for theme in *; do
	    if [ -d "${theme}" ]; then
	        cd "${theme}" && npm run prod
	        if [ $2 == "-t" ] || [ $2 == "-type" ]; then
	        	npm run bump -- -type $3
	        fi
	        cd ..
	    fi
	done
}
if [ -d "wp-content" ]; then
	buildTheme wp-content $1 $2
else
	buildTheme content $1 $2
fi
