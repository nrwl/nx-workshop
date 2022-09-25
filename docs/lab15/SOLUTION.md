##### Final CI config

```yml
name: Run CI checks

on: [pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    name: Building affected apps
    steps:
      - uses: actions/checkout@v1
      - uses: bahmutov/npm-install@v1.4.5
      - run: npm run nx affected -- --target=build --base=origin/main --parallel
  test:
    runs-on: ubuntu-latest
    name: Testing affected apps
    steps:
      - uses: actions/checkout@v1
      - uses: bahmutov/npm-install@v1.4.5
      - run: npm run nx affected -- --target=test --base=origin/main --parallel
  lint:
    runs-on: ubuntu-latest
    name: Linting affected apps
    steps:
      - uses: actions/checkout@v1
      - uses: bahmutov/npm-install@v1.4.5
      - run: npm run nx affected -- --target=lint --base=origin/main --parallel
  e2e:
    runs-on: ubuntu-latest
    name: E2E testing affected apps
    steps:
      - uses: actions/checkout@v1
      - uses: bahmutov/npm-install@v1.4.5
      - run: npm run nx affected -- --target=e2e --base=origin/main --parallel
```

##### Marking all projects as affected

```json
  "implicitDependencies": {
    ".github/workflows/ci.yml": "*",
```
