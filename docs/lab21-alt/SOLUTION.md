##### GitHub CD setup

```
name: Deploy Website

on:
  push:
    branches:
      - main

env:
  SURGE_DOMAIN_STORE: ${{ secrets.SURGE_DOMAIN_STORE }}
  SURGE_DOMAIN_ADMIN_UI: ${{ secrets.SURGE_DOMAIN_ADMIN_UI }}
  SURGE_TOKEN: ${{ secrets.SURGE_TOKEN }}

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
      - run: npx nx build admin-ui --configuration=production
      - run: npx nx deploy store
      - run: npx nx deploy admin-ui
```
