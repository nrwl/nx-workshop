/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatFiles, Tree } from '@nrwl/devkit';

export default async function update(host: Tree) {
  host.write(
    '.github/workflows/deploy.yml',
    `
name: Deploy Website

on:
  push:
    branches:
      - main

env:
  SURGE_DOMAIN: \${{ secrets.SURGE_DOMAIN }}
  SURGE_TOKEN: \${{ secrets.SURGE_TOKEN }}
  FLY_API_TOKEN: \${{ secrets.FLY_API_TOKEN }}

jobs:
  build:
    runs-on: ubuntu-latest
    name: Deploying apps
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: bahmutov/npm-install@v1
      - uses: nrwl/nx-set-shas@v2
      - run: npx nx affected --target=build --base=\${{ env.NX_BASE }} --parallel --configuration=production
      - run: npx nx affected --target=deploy --base=\${{ env.NX_BASE }} --parallel
`
  );
  await formatFiles(host);
}
