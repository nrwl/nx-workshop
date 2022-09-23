import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration, readJson } from '@nrwl/devkit';

import generator from './generator';
import migrations from '../../../migrations.json';

jest.mock('@nrwl/devkit', () => ({
  ...jest.requireActual<any>('@nrwl/devkit'),
  readJsonFile: () => migrations,
}));

describe('Complete Labs generator', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should create migration for single lab', async () => {
    await generator(appTree, { lab: 3 });
    const { migrations } = readJson(appTree, 'migrations.json');
    expect(migrations.length).toBe(1);
    expect(migrations[0].version).toEqual('0.1.3');
  });

  it('should create migration up to given lab', async () => {
    await generator(appTree, { to: 10 });
    const { migrations } = readJson(appTree, 'migrations.json');
    expect(migrations.length).toBe(10);
    expect(migrations[0].version).toEqual('0.1.1');
    expect(migrations[9].version).toEqual('0.1.10');
  });

  it('should create migration from given lab', async () => {
    await generator(appTree, { from: 8 });
    const { migrations } = readJson(appTree, 'migrations.json');
    expect(migrations.length).toBe(17);
    expect(migrations[0].version).toEqual('0.1.8');
    expect(migrations[16].version).toEqual('0.1.22');
    // const config = readProjectConfiguration(appTree, 'test');
    // expect(config).toBeDefined();
  });

  it('should respect options - option 1', async () => {
    await generator(appTree, { from: 8, option: 'option1' });
    const { migrations } = readJson(appTree, 'migrations.json');
    expect(migrations.length).toBe(17);
    expect(migrations[16].version).toEqual('0.1.22');
  });

  it('should respect options - option 2', async () => {
    await generator(appTree, { from: 8, option: 'option2' });
    const { migrations } = readJson(appTree, 'migrations.json');
    expect(migrations.length).toBe(17);
    expect(migrations[16].version).toEqual('0.1.22');
  });
});
