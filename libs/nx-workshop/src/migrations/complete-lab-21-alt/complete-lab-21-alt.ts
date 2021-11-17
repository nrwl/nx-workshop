/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tree } from '@nrwl/devkit';

export default function update(host: Tree) {
  host.write(
    `.github/workflows/deploy.yml`,
    `
name: Deploy Website

on:
  push:
    branches:
      - master

env:
  SURGE_DOMAIN_STORE: \${{ secrets.SURGE_DOMAIN_STORE }}
  SURGE_DOMAIN_ADMIN_UI: \${{ secrets.SURGE_DOMAIN_ADMIN_UI }}
  SURGE_TOKEN: \${{ secrets.SURGE_TOKEN }}

jobs:
  build:
    runs-on: ubuntu-latest
    name: Deploying apps
    steps:
      - uses: actions/checkout@v2.3.4
      - uses: bahmutov/npm-install@v1.4.5
      - run: npm run nx build store -- --configuration=production
      - run: npm run nx build admin-ui -- --configuration=production
      - run: npm run nx deploy store
      - run: npm run nx deploy admin-ui
`
  );
}
