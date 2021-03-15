##### Increment version number

```typescript
import { formatFiles, Tree, updateJson } from '@nrwl/devkit';

function incrementVersion(host: Tree) {
  updateJson(host, 'workspace.json', (json) => {
    json.version++;
    return json;
  });
}

export default async function(host: Tree) {
  incrementVersion(host);
  await formatFiles(host);
}
```
