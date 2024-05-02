#!/bin/sh
echo "Current version: $(<VERSION)"
echo "Enter new version number?"
read v
bundle exec jekyll build
mv node_modules ..
git checkout _site
mv _site ..
rm -rf ./*
mv ../_site/* .
rm -rf ../_site
git add .
git commit -m "$v"
git push
git checkout develop
mv ../node_modules .
rm VERSION
touch VERSION
echo "$v" >> VERSION
