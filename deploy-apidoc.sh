#!/bin/bash

apidoc -i src -o doc/

if [ -d "/usr/local/nginx/html" ]; then
    cp -r doc/* /usr/local/nginx/html/
    cp presentations/*.svg /usr/local/nginx/html/img
    cp presentations/*.html /usr/local/nginx/html
fi
