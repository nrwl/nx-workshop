/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tree, formatFiles } from '@nrwl/devkit';

export default async function update(host: Tree) {
  host.write(
    '.github/workflows/ci.yml',
    `
name: Run CI checks

on: [pull_request]

env:
  NX_BRANCH: \${{ github.event.number }}
  NX_RUN_GROUP: \${{ github.run_id }}

jobs:
  build:
    runs-on: ubuntu-latest
    name: Building affected apps
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: bahmutov/npm-install@v1
      - run: npx nx affected --target=build --base=origin/main --parallel
      - run: npx nx affected --target=test --base=origin/main --parallel
      - run: npx nx affected --target=lint --base=origin/main --parallel
      - run: npx nx affected --target=e2e --base=origin/main --parallel
`
  );
  await formatFiles(host);
}
