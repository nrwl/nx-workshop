import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';
import { updateJson } from '@nrwl/devkit';

export default async function (host: Tree, schema: any) {
  updateJson(host, 'workspace.json', (json) => {
    json.defaultProject = 'api';
    return json;
  })
  await formatFiles(host);
}
