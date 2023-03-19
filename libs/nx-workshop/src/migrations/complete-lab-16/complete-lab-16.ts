/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tree } from '@nrwl/devkit';
import { execSync } from 'child_process';

export default function update(host: Tree) {
  execSync(`npx nx g @nrwl/nx-cloud:init`, {
    stdio: [0, 1, 2],
  });
}
