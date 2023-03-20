# 🧲 Lab 19 - Deploying the API with custom executor

###### ⏰ Estimated time: 30 minutes

<br />

## 📚 Learning outcomes

- **Explore creating a custom executor**
- **Go through an example of how to deploy an API to Fly.io through Nx**
  <br /><br /><br />

## 🏋️‍♀️ Steps

1. For this workshop you'll need two CLI tools installed:

   - [Fly CLI](https://fly.io/terminal)
     - Verify installation via: `fly version`
   - [Docker](https://www.docker.com/get-started) - Verify via `docker --version`
     <br /> <br />

2. Let's prepare Fly to deploy our API:

   ```shell
   # login first
   fly auth login
   # Get an authorization token so we don't have to login everytime
   fly auth token
   ```

   ⚠️ Make sure you remember and keep track of the authorization token, as we'll use it later.

3. Let's setup our ENV variables from the beginning now

   `apps/api/.local.env`

   ```
   FLY_API_TOKEN=<your-fly-token>
   ```

   <br />

4. Create a new file `apps/api/src/fly.toml`

   Pick a unique app name to include in the `fly.toml` file.

    👉 This will determine the address where the API will be deployed to: `https://<your-app-name>.fly.dev`

    ```
    app = "<your-unique-app-name>"
    kill_signal = "SIGINT"
    kill_timeout = 5
    processes = []

    [build]
      builder = "paketobuildpacks/builder:base"
      buildpacks = ["gcr.io/paketo-buildpacks/nodejs"]

    [env]
      PORT = "8080"

    [experimental]
      cmd = ["PORT=8080 node main.js"]

    [[services]]
      http_checks = []
      internal_port = 8080
      processes = ["app"]
      protocol = "tcp"
      script_checks = []
      [services.concurrency]
        hard_limit = 25
        soft_limit = 20
        type = "connections"

    [[services.ports]]
      force_https = true
      handlers = ["http"]
      port = 80

    [[services.ports]]
      handlers = ["tls", "http"]
      port = 443

    [[services.tcp_checks]]
      grace_period = "1s"
      interval = "15s"
      restart_limit = 0
      timeout = "2s"
    ```

   <details>
   <summary>❓ What's our plan here?</summary>

   Fly will launch a pre-build node Docker image (or you could provide your own) and then run the command you specify to launch the server.

   So the plan is:

   - define a `fly.toml` with instructions for fly to deploy the server
   - when we want to deploy, we'll build our app to `dist/apps/api`
   - as part of the build, we need to make sure that our `fly.toml` file makes it into `dist/apps/api`
   - Fly will copy the bundled code to the remote server and run the node server via `cmd = ["PORT=8080 node main.js"]`
   </details>
   <br />

5. If you `nx build api` right now

   - 👍 Then `cd dist/apps/api && node main.js`
     It should work. Because it has access to `node_modules`
   - 👎 If you copy your built sources to some other folder on your file system.
     And then try to `node main.js` in that folder that doesn't hace access to `node_modules` - it will fail

   💡 By default, dependencies of server projects are not bundled together, as opposed to your Angular apps.
   If curious why, you can [read more here](https://github.com/nestjs/nest/issues/1706#issuecomment-579248915).
   <br /> <br />

6. Let's fix the above - In `project.json`, under the **production** build options for the API (`targets -> build -> configurations -> production`)
   add this as an option:

    ```json
    "externalDependencies": [
        "@nestjs/microservices",
        "@nestjs/microservices/microservices-module",
        "@nestjs/websockets/socket-module",
        "class-transformer",
        "class-validator",
        "cache-manager",
        "cache-manager/package.json"
    ],
    ```

     <details>
     <summary>❓ What does this do?</summary>

     The above option tells webpack to bundle ALL the dependencies our API requires inside `main.js`, except the ones above (which fail the build if we tell webpack to include, because they're lazily loaded).
     Normally, it's not recommended to bundle any dependencies with your server bundles,
     but in this case it simplifies the deployment process.
     </details>
       <br />

7. Currently the `fly.toml` that we added to our `api` project is not present if we inspect the `dist/apps/api` directory after running a prod build. We'll need this to be present for our fly deployment.

    Update the the `assets` option in the production build options for the API (`targets -> build -> configurations -> production`)

    ```json
    "assets": [
        "apps/api/src/assets",
        "apps/api/src/fly.toml"
    ],
    ```

8. Use the `@nrwl/nx-plugin:executor` generator to generate a `fly-deploy` executor:

   - The executor should have options for:
     - the target `dist` location
     - the `name` of your fly app
   - When running, your executor should perform the following tasks, using the `fly` cli:
     - list the current fly apps: `fly apps list`
     - if the app doesn't exist, launch it: `fly launch --now --name=<the name of your Fly App> --region=lax`
     - if the app does exist, deploy it again: `fly deploy`

    Fly launch and deploy commands need to be run in the `dist` location of your app.

    Use the `@nrwl/nx-plugin:executor` to generator an executor in our `internal-plugin` project for this:

    ```shell
    npx nx generate @nrwl/nx-plugin:executor fly-deploy --project=internal-plugin
    ```

9. Adjust the generated `schema.json` and `schema.d.ts` file to match the required options:

    ```json
    {
      "$schema": "http://json-schema.org/schema",
      "cli": "nx",
      "title": "FlyDeploy executor",
      "description": "",
      "type": "object",
      "properties": {
        "distLocation": {
          "type": "string"
        },
        "flyAppName": {
          "type": "string"
        }
      },
      "required": ["distLocation", "flyAppName"]
    }
    ```

    ```typescript
    export interface FlyDeployExecutorSchema {
      distLocation: string;
      flyAppName: string;
    }
    ```

10. Implement the required fly steps using `execSync` to call the `fly` cli inside your `executor.ts` file:

    ```typescript
    import { FlyDeployExecutorSchema } from './schema';
    import { execSync } from 'child_process';

    export default async function runExecutor(schema: FlyDeployExecutorSchema) {
      const cwd = schema.distLocation;
      const results = execSync(`fly apps list`);
      if (results.toString().includes(options.flyAppName)) {
        execSync(`fly deploy`, { cwd });
      } else {
        execSync(`fly launch --now --name=${options.flyAppName} --region=lax`, {
          cwd,
        });
      }
      return {
        success: true,
      };
    }
    ```

11. Next we'll need to add a `deploy` target to our `apps/api/project.json` file:

    ```json
    {
      "deploy": {
        "executor": "@bg-hoard/internal-plugin:fly-deploy",
        "outputs": [],
        "options": {
          "distLocation": "dist/apps/api",
          "flyAppName": "my-unique-app-name"
        },
        "dependsOn": [
          { "target": "build", "projects": "self", "params": "forward" }
        ]
      }
    }
    ```

12. Let's enable CORS on the server so our API can make requests to it (since they'll be deployed in separate places):

    - In `apps/api/src/main.ts`
    - Enable CORS:

      ```ts
      async function bootstrap() {
          const app = await NestFactory.create(AppModule);
          const globalPrefix = 'api';
          app.setGlobalPrefix(globalPrefix);
          app.enableCors(); // <--- ADD THIS
      }
      ```

    ⚠️ Normally, you want to restrict this to just a few origins. But to keep things simple in this workshop we'll enable it for all origins.
    <br /> <br />

12. Now run the command to deploy your api!!

    ```shell
    npx nx deploy api --prod
    ```

    Because of how we set up our `dependsOn` for the `deploy` target, Nx will know that it needs to run (or pull from the cache if you already ran it) the production build of the api before then running the deploy!

13. Go to `https://<your-app-name>.fly.dev/api/games` - it should return you a list of games.
    <br /> <br />

14. **BONUS** - What would a meaningful test be for your new executor? Add it to `libs/internal-plugin/src/executors/fly-deploy/executors.spec.ts`

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab20/LAB.md)
