#!/usr/bin/env bash

for file in $(find . -name '*json' -not -path './node_modules/*'); do
    data=$(npx json --validate -f $file 2>&1)
    if [[ $? -ne 0 ]]; then
	echo "JSON validation error in: $file"
	printf "$data\n"
    fi
done
