/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatFiles, Tree, updateJson } from '@nrwl/devkit';
import pluginGenerator from '@nrwl/nx-plugin/src/generators/plugin/plugin';
import generatorGenerator from '@nrwl/nx-plugin/src/generators/generator/generator';
import { Linter } from '@nrwl/linter';

export default async function update(host: Tree) {
  // nx generate @nrwl/workspace:workspace-generator util-lib
  pluginGenerator(host, {
    name: 'internal-plugin',
    skipTsConfig: false,
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
    compiler: 'tsc',
    skipFormat: false,
    skipLintChecks: false,
    minimal: true,
  });

  generatorGenerator(host, {
    name: 'util-lib',
    project: 'internal-plugin',
    unitTestRunner: 'jest',
  });

  host.write(
    'tools/generators/util-lib/index.ts',
    `
    import { formatFiles, installPackagesTask, Tree } from '@nrwl/devkit';
    import nrwlJsLibraryGenerator from '@nrwl/workspace/src/generators/library/library';
    import { UtilLibGeneratorSchema } from './schema';

    export default async function (tree: Tree, options: UtilLibGeneratorSchema) {
      await nrwlJsLibraryGenerator(tree, {
        ...options,
        name: \`util-\${options.name}\`,
        tags: \`type:util, scope:\${options.directory}\`,
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
    `
    export interface UtilLibGeneratorSchema {
      name: string;
      directory: 'store' | 'api' | 'shared';
    }
`
  );
  updateJson(
    host,
    'libs/internal-plugin/src/generators/util-lib/schema.json',
    (json) => {
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
  await formatFiles(host);
}
