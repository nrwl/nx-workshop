##### BONUS: Executor Test

```typescript
import { HerokuDeployExecutorSchema } from './schema';
import executor from './executor';
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));
import { execSync } from 'child_process';

describe('HerokuDeploy Executor', () => {
  beforeEach(() => {
    (execSync as any) = jest.fn();
  });

  it('runs the correct heroku cli commands', async () => {
    const options: HerokuDeployExecutorSchema = {
      distLocation: 'dist/apps/foo',
      herokuAppName: 'foo',
    };
    const output = await executor(options);
    expect(output.success).toBe(true);
    expect(execSync).toHaveBeenCalledWith(`heroku container:login`, {
      cwd: 'dist/apps/foo',
    });
    expect(execSync).toHaveBeenCalledWith(
      `heroku container:push web --app foo`,
      {
        cwd: 'dist/apps/foo',
      }
    ),
      expect(execSync).toHaveBeenCalledWith(
        `heroku container:release web --app foo`,
        {
          cwd: 'dist/apps/foo',
        }
      );
  });
});
```
