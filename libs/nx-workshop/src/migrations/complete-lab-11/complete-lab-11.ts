/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatFiles, Tree } from '@nx/devkit';

export default async function update(host: Tree) {
  host.write(
    'apps/store-ui-shared-e2e/src/e2e/header/header.component.cy.ts',
    `
    describe('store-ui-shared', () => {
      beforeEach(() =>
        cy.visit('/iframe.html?id=headercomponent--primary&args=title:BoardGameHoard')
      );
      it('should render the component', () => {
        cy.get('bg-hoard-header').contains('BoardGameHoard');
      });
    });
    `
  );
  await formatFiles(host);
}
