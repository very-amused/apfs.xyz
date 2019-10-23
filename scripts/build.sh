#!/usr/bin/env bash

# Store root working directory
root="$(pwd)"

# Build static pages
cd $root/static
npx tsc

# Build API
cd $root/API
npx tsc