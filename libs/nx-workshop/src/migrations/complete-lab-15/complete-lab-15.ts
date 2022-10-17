/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatFiles, Tree, updateJson } from '@nrwl/devkit';

export default async function update(host: Tree) {
  host.write(
    '.github/workflows/ci.yml',
    `
name: Run CI checks

on: [pull_request]

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
  updateJson(host, 'nx.json', (json) => {
    json['implicitDependencies'] = json['implicitDependencies'] || {};
    json['implicitDependencies']['.github/workflows/ci.yml'] = '*';
    return json;
  });
  await formatFiles(host);
}
