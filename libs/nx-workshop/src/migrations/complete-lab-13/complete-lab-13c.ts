/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatFiles, Tree } from '@nx/devkit';

export default async function update(host: Tree) {
  host.write(
    'libs/api/util-notifications/src/lib/api-util-notifications.ts',
    `
    export function sendNotification(clientId: string) {
      console.log("sending notification to client: ", clientId);
    }
`
  );
  await formatFiles(host);
}
