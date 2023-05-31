import { Tree } from '@nx/devkit';
import * as ts from 'typescript';
import { insertImport as astInsertImport } from '@nx/js';

export function replaceInFile(
  host: Tree,
  path: string,
  find: string,
  replace: string
) {
  const newContent = host.read(path).toString().replace(find, replace);
  host.write(path, newContent);
}
export function insertImport(
  host: Tree,
  path: string,
  symbolName: string,
  importPath: string
) {
  const moduleSource = host.read(path, 'utf-8');

  const sourceFile = ts.createSourceFile(
    path,
    moduleSource,
    ts.ScriptTarget.Latest,
    true
  );

  return astInsertImport(host, sourceFile, path, symbolName, importPath);
}

export function stripConsoleColors(log: string): string {
  return log.replace(
    // eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}
