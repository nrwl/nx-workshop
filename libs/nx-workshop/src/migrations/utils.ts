import { Tree } from '@nrwl/devkit';
import * as ts from 'typescript';
import { insertImport as astInsertImport } from '@nrwl/workspace/src/utils/ast-utils';

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

  return astInsertImport(sourceFile, path, symbolName, importPath);
}
