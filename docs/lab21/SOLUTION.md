##### GitHub CD setup

```
name: Deploy Website

on:
  push:
    branches:
      - master

env:
  SURGE_DOMAIN: ${{ secrets.SURGE_DOMAIN }}
  SURGE_TOKEN: ${{ secrets.SURGE_TOKEN }}
  FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

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
```
