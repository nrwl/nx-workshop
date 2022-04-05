/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatFiles, Tree } from '@nrwl/devkit';

export default async function update(host: Tree) {
  host.write(
    'apps/store-ui-shared-e2e/src/integration/header/header.component.spec.ts',
    `
    describe('store-ui-shared: Header component', () => {
      beforeEach(() =>
        cy.visit('/iframe.html?id=headercomponent--primary&args=title:BoardGameHoard')
      );

      it('should show the title', () => {
        cy.get('header').contains('Board Game Hoard');
      });
    });
    `
  );
  await formatFiles(host);
}
