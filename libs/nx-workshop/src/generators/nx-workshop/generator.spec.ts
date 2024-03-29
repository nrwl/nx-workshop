import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import generator from './generator';
import { NxWorkshopGeneratorSchema } from './schema';

describe('nx-workshop generator', () => {
  let appTree: Tree;
  const options: NxWorkshopGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
