#### Generating an executor

```bash
npx nx g @nrwl/nx-plugin:executor --name=fly-deploy --project=internal-plugin
```

##### BONUS: Executor Test

```typescript
import { FlyDeployExecutorSchema } from './schema';
import executor from './executor';
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));
import { execSync } from 'child_process';

describe('FlyDeploy Executor', () => {
  beforeEach(() => {
    (execSync as any) = jest.fn();
  });

  it('runs the correct fly cli commands', async () => {
    const options: FlyDeployExecutorSchema = {
      distLocation: 'dist/apps/foo',
      flyAppName: 'foo',
    };
    const output = await executor(options);
    expect(output.success).toBe(true);
    expect(execSync).toHaveBeenCalledWith(`fly apps list`, {
      cwd: 'dist/apps/foo',
    });
    expect(execSync).toHaveBeenCalledWith(
      `fly launch --now --name=foo --region=lax`,
      {
        cwd: 'dist/apps/foo',
      }
    );
  });
});
```
