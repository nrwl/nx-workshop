/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatFiles, Tree, updateJson } from '@nrwl/devkit';
import { pluginGenerator, generatorGenerator } from '@nrwl/nx-plugin/generators';
import { Linter } from '@nrwl/linter';

export default async function update(host: Tree) {
  // nx generate @nrwl/workspace:workspace-generator util-lib
  await pluginGenerator(host, {
    name: 'internal-plugin',
    skipTsConfig: false,
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
    compiler: 'tsc',
    skipFormat: false,
    skipLintChecks: false,
    minimal: true,
  });

  await generatorGenerator(host, {
    name: 'util-lib',
    project: 'internal-plugin',
    unitTestRunner: 'jest',
  });

  host.write(
    'libs/internal-plugin/src/generators/util-lib/generator.ts',
    `import { formatFiles, installPackagesTask, Tree } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';
import { UtilLibGeneratorSchema } from './schema';

export default async function (tree: Tree, schema: UtilLibGeneratorSchema) {
  await libraryGenerator(tree, {
    name: \`util-\${schema.name}\`,
    directory: schema.directory,
    tags: \`type:util, scope:\${schema.directory}\`,
  });
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
    `
  );
  host.write(
    'libs/internal-plugin/src/generators/util-lib/schema.d.ts',
    `export interface UtilLibGeneratorSchema {
  name: string;
  directory: 'store' | 'api' | 'shared';
}
`
  );
  updateJson(
    host,
    'libs/internal-plugin/src/generators/util-lib/schema.json',
    (json) => {
      delete json.properties.tags;
      return {
        ...json,
        properties: {
          ...json.properties,
          directory: {
            type: 'string',
            description: 'The scope of your lib.',
            'x-prompt': {
              message: 'Which directory do you want the lib to be in?',
              type: 'list',
              items: [
                {
                  value: 'store',
                  label: 'store',
                },
                {
                  value: 'api',
                  label: 'api',
                },
                {
                  value: 'shared',
                  label: 'shared',
                },
              ],
            },
          },
        },
      };
    }
  );
  host.write(
    'libs/internal-plugin/src/generators/util-lib/generator.spec.ts',
    `import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { UtilLibGeneratorSchema } from './schema';

describe('util-lib generator', () => {
  let appTree: Tree;
  const options: UtilLibGeneratorSchema = { name: 'foo', directory: 'store' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should add util to the name and add appropriate tags', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'store-util-foo');
    expect(config).toBeDefined();
    expect(config.tags).toEqual(['type:util', 'scope:store']);
  });
});
    `);
  await formatFiles(host);
}
