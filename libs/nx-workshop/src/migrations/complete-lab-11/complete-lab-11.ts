/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tree } from '@nrwl/devkit';

export default function update(host: Tree) {
  host.write(
    'apps/store-ui-shared-e2e/src/integration/header/header.spec.ts',
    `
    describe('store-ui-shared: Header component', () => {
      beforeEach(() =>
        cy.visit('/iframe.html?id=header--primary&args=title:BoardGameHoard')
      );

      it('should show the title', () => {
        cy.get('header').contains('Board Game Hoard');
      });
    });
    `
  );
}
