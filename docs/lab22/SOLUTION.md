##### The full deploy script

```
name: Deploy Website

on:
  push:
    branches:
      - master

env:
  SURGE_DOMAIN_STORE: ${{ secrets.SURGE_DOMAIN_STORE }}
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
      - uses: nrwl/nx-set-shas@v2
        with:
          main-branch-name: 'main' # remember to set this correctly
      - run: npx nx affected --target=build --base=${{ env.NX_BASE }} --parallel --configuration=production
      - run: npx nx affected --target=deploy --base=${{ env.NX_BASE }} --parallel
```
