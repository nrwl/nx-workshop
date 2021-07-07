import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

type FeatureLibDirectory = 'store' | 'api' | 'shared';

interface FeatureLibGeneratorSchema {
  name: string;
  directory: FeatureLibDirectory;
}

export default async function (host: Tree, schema: FeatureLibGeneratorSchema) {
  await libraryGenerator(host, {
    name: `feature-${schema.name}`,
    directory: schema.directory,
    tags: `scope:${schema.directory}, type:feature`,
  });
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
