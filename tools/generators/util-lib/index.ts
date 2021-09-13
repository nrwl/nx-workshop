import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

interface Schema {
  name: string;
  directory: 'store' | 'api' | 'shared';
}

export default async function (host: Tree, schema: Schema) {
  await libraryGenerator(host, {
    name: `util-${schema.name}`,
    directory: schema.directory,
    tags: `type:util, scope:${schema.directory}`,
  });
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
