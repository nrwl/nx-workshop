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
  HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}

jobs:
  build:
    runs-on: ubuntu-latest
    name: Deploying apps
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - uses: bahmutov/npm-install@v1
      - uses: nrwl/nx-set-shas@v2
        with:
          main-branch-name: 'main' # remember to set this correctly
      - run: npm run nx affected -- --target=build --base=${{ env.NX_BASE }} --parallel --configuration=production
      - run: npm run nx affected -- --target=deploy --base=${{ env.NX_BASE }} --parallel
```
