import { formatFiles, Tree } from '@nx/devkit';

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
      - run: npx nx build store --configuration=production
      - run: npx nx build api --configuration=production
      - run: npx nx deploy store
      - run: npx nx deploy api
`
  );
  await formatFiles(host);
}
