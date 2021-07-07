import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

type UtilLibDirectory = 'store' | 'api' | 'shared';

interface UtilLibGeneratorSchema {
  name: string;
  directory: UtilLibDirectory;
}

export default async function (host: Tree, schema: UtilLibGeneratorSchema) {
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
