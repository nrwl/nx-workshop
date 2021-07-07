import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

interface LibSchema {
  name: string;
  directory: 'store' | 'api' | 'shared'
}

export default async function (host: Tree, schema: LibSchema) {
  await libraryGenerator(host, {
    name: `util-${schema.name}`,
    directory: schema.directory,
    tags: `scope:${schema.directory}, type:util`,
  });
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
