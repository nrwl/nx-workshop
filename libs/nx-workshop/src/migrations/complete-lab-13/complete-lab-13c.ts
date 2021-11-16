/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tree } from '@nrwl/devkit';

export default function update(host: Tree) {
  host.write(
    'libs/api/util-notifications/src/lib/api-util-notifications.ts',
    `
    export function sendNotification(clientId: string) {
      console.log("sending notification to client: ", clientId);
    }
`
  );
}
