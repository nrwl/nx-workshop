import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { UtilLibGeneratorSchema } from './schema';

describe('util-lib generator', () => {
  let appTree: Tree;
  const options: UtilLibGeneratorSchema = { name: 'foo', directory: 'store' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should add util to the name and add appropriate tags', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'store-util-foo');
    expect(config).toBeDefined();
    expect(config.tags).toEqual(['type:util', 'scope:store']);
  });
});
