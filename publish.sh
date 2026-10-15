#!/bin/sh
# Builds the site and publishes it to the `site` branch.
#
# Stops at the first error, refuses to run with uncommitted changes, and
# builds the `site` branch in a temporary worktree so this working copy is
# never touched.
set -eu
cd "$(dirname "$0")"

if [ -n "$(git status --porcelain)" ]; then
  echo "You have uncommitted changes – commit or stash them first."
  exit 1
fi

echo "Current version: $(cat VERSION 2>/dev/null || echo none)"
printf "Enter new version number? "
read -r v

JEKYLL_ENV=production bundle exec jekyll build

worktree=$(mktemp -d)
trap 'git worktree remove --force "$worktree" 2>/dev/null || true' EXIT
git worktree add "$worktree" site

# Replace everything on the site branch with the fresh build
find "$worktree" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R _site/. "$worktree"/

git -C "$worktree" add -A
git -C "$worktree" commit -m "$v"
git -C "$worktree" push origin site

echo "$v" > VERSION
echo "Published $v"
