import { chain, Rule } from '@angular-devkit/schematics';
import { updateJsonInTree } from '@nrwl/workspace';

function incrementVersion(): Rule {
  return updateJsonInTree('workspace.json', (json) => {
    json.version++;
    return json;
  });
}

export default function (): Rule {
  return chain([incrementVersion()]);
}
