#!/usr/bin/env bash
# Deploys the built Storybook to ui.hiten.dev (nginx static dir on this VM).
set -euo pipefail
cd "$(dirname "$0")/.."
pnpm build-storybook
rsync -a --delete storybook-static/ /home/ubuntu/stack/ui-hiten-dev/site/
echo "Deployed to https://ui.hiten.dev"
