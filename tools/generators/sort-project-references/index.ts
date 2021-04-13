import { formatFiles, Tree, updateJson } from '@nrwl/devkit';
import { join } from 'path';

function sortKeys(host: Tree, file: string) {
  updateJson(host, file, (json) => {
    json.projects = sortObjectKeys(json.projects);
    return json;
  });
}

function sortObjectKeys(obj: any) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted;
}

function sortTsConfigPaths(host: Tree) {
  updateJson(host, 'tsconfig.base.json', (json) => {
    json.compilerOptions.paths = sortObjectKeys(json.compilerOptions.paths);
    return json;
  });
}

function sortJest(host: Tree) {
  const jestConfig = 'jest.config.js';
  const contents = require(join(process.cwd(), jestConfig));
  contents.projects.sort();
  host.write(
    jestConfig,
    `
        module.exports = ${JSON.stringify(contents)};
      `
  );
}

export default async function (host: Tree) {
  sortKeys(host, 'workspace.json');
  sortKeys(host, 'nx.json');
  sortTsConfigPaths(host);
  sortJest(host);
  await formatFiles(host);
}
