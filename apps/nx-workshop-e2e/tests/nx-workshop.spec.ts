import {
  checkFilesExist,
  ensureNxProject,
  runNxCommand,
} from '@nx/plugin/testing';
describe('nx-workshop e2e', () => {
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
  for (let i=1;i<21;i++) {
    describe(`lab ${i}`, () => {
      it(`should complete`, () => {
        completeLab(i);
      });
    });
  }
  // describe('lab 1', () => {
  //   it(`should complete`, () => {
  //     completeLab(1);
  //   });
  // });
  // describe('lab 2', () => {
  //   it(`should complete`, () => {
  //     completeLab(2);
  //   });
  // });
  // describe('lab 3', () => {
  //   it(`should complete`, () => {
  //     completeLab(3);
  //   });
  // });
  // describe('lab 4', () => {
  //   it(`should complete`, () => {
  //     completeLab(4);
  //   });
  // });
  // describe('lab 5', () => {
  //   it(`should complete`, () => {
  //     completeLab(5);
  //   });
  // });
  // describe('lab 6', () => {
  //   it(`should complete`, () => {
  //     completeLab(6);
  //   });
  // });
  // describe('lab 7', () => {
  //   it(`should complete`, () => {
  //     completeLab(7);
  //   });
  // });
  // describe('lab 8', () => {
  //   it(`should complete`, () => {
  //     completeLab(8);
  //   });
  // });
  // describe('lab 9', () => {
  //   it(`should complete`, () => {
  //     completeLab(9);
  //   });
  // });
  // describe('lab 10', () => {
  //   it(`should complete`, () => {
  //     completeLab(10);
  //   });
  // });
});
