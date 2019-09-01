#!/bin/sh
date

if ! [ -d "node_modules" ]; then
  npm install
fi
