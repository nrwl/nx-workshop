import { Tree } from '@nrwl/devkit';

export function replaceInFile(
  host: Tree,
  path: string,
  find: string,
  replace: string
) {
  const newContent = host.read(path).toString().replace(find, replace);
  host.write(path, newContent);
}
