import {
  checkFilesExist,
  ensureNxProject,
  runNxCommand,
} from '@nx/plugin/testing';
describe('nx-workshop e2e', () => {
  describe('migrations', () => {
    it('should run the migrations', () => {
      ensureNxProject('@nrwl/nx-workshop', 'dist/libs/nx-workshop');
      expect(() => checkFilesExist(`libs`)).not.toThrow();
      expect(() => checkFilesExist(`node_modules/.bin/nx`)).not.toThrow();
    }, 120000);
    function completeLab(labNumber) {
      console.log(`Completing lab ${labNumber}`);
      process.env.NX_DAEMON = 'false';
      runNxCommand(
        `generate @nrwl/nx-workshop:complete-labs --lab=${labNumber}`
      );
      runNxCommand('migrate --run-migrations');
      runNxCommand('run-many --target=e2e --parallel=false');
    }
    for (let i = 1; i < 20; i++) {
      it(`should complete lab ${i}`, () => {
        completeLab(i);
      });
    }
  });
});
