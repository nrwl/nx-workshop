# 🧲 Lab 19 - Deploying the API

###### ⏰ Estimated time: 30 minutes

<br />

## 📚 Learning outcomes

- **Explore creating a custom executor**
- **Go through an example of how to deploy an API to Heroku through Nx**
  <br /><br /><br />

## 🏋️‍♀️ Steps

1. For this workshop you'll need two CLI tools installed:

   - [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
     - Verify installation via: `heroku --version`
   - [Docker](https://www.docker.com/get-started) - Verify via `docker --version`
     <br /> <br />

2. Let's prepare Heroku to deploy our API:

   ```shell
   # login first
   heroku login
   # create a new Heroku app where we'll deploy the API
   heroku create <choose some unique name for your api>
   # Get an authorization token so we don't have to login everytime
   heroku authorizations:create
   ```

   ⚠️ Make sure you remember and keep track of these values, as we'll use them later:

   - The authorization "Token"
   - The exact app name you used  
      👉 This will determine the address where the API will
     be deployed to: `https://<your-app-name>.herokuapp.com`
     <br /> <br />

3. Let's setup our ENV variables from the beginning now

   `apps/api/.local.env`

   ```
   HEROKU_API_KEY=<your-heroku-token>
   ```

   <br />

4. Create a new file `apps/api/Dockerfile`

   ```dockerfile
   # use images supported by heroku
   FROM --platform=linux/amd64 node:14.17.0-alpine
   # switch to the /app folder in the image
   WORKDIR /app
   # copy all files from the folder its in into the /app folder we switched to
   COPY ./ ./
   # launch the main.js file
   CMD node main.js
   ```

   <details>
   <summary>❓ What's our plan here?</summary>

   Heroku allows you to do container deployments.
   You define a Docker image that will run your server code.
   You then point the Heroku CLI to your image, and it will build it, deploy it, and run it at the remote address.

   So the plan is:

   - define a Docker image and have it sit idly in our app's source folder
   - when we want to deploy, we'll build our app to `dist/apps/api`
   - we'll then copy this image over to `dist/apps/api`
   - because it will be in the same folder as our built assets, it will copy all of them into the container via the `COPY ./ ./` instruction
   - and then run the server via `CMD node main.js`
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

6. Let's fix the above - In `project.json`, under the **production** build options for the API (`projects -> api -> targets -> build -> configurations -> production`)
   add this as an option:

```json
"externalDependencies": [
    "@nestjs/microservices",
    "@nestjs/microservices/microservices-module",
    "@nestjs/websockets/socket-module",
    "class-transformer",
    "class-validator",
    "cache-manager"
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

7. Currently the `Dockerfile` that we added to our `api` project is not present if we inspect the `dist/apps/api` directory after running a prod build. We'll need this to be present for our heroku deployment.

Update the the `assets` option in the production build options for the API (`projects -> api -> targets -> build -> configurations -> production`)

```json
"assets": [
    "apps/api/src/assets",
    { "glob": "Dockerfile", "input": "apps/api", "output": "." }
],
```

8. Use the `@nrwl/nx-plugin:executor` generator to generate a `heroku-deploy` exector:

- The executor should have options for:
  - the target dist location
  - the name of your heroku app
- When running, your executor should perform the following tasks, using the `heroku` cli:

  - login: `heroku container:login`
  - push: `heroku container:push web -a <the name of your Heroku App>`
  - release: `heroku container:release web -a <the name of your Heroku App>`

  Use the `@nrwl/nx-plugin:executor` to generator an executor in our `internal-plugin` project for this:

  ```shell
  npx nx generate @nrwl/nx-plugin:executor heroku-deploy --project=internal-plugin
  ```

9. Adjust the generated `schema.json` and `schema.d.ts` file to match the required options:

```json
{
  "$schema": "http://json-schema.org/schema",
  "cli": "nx",
  "title": "HerokuDeploy executor",
  "description": "",
  "type": "object",
  "properties": {
    "distLocation": {
      "type": "string"
    },
    "herokuAppName": {
      "type": "string"
    }
  },
  "required": ["distLocation", "herokuAppName"]
}
```

```typescript
export interface HerokuDeployExecutorSchema {
  distLocation: string;
  herokuAppName: string;
}
```

10. Implement the required heroku steps using `execSync` to call the `heroku` cli inside your `exector.ts` file:

```typescript
import { HerokuDeployExecutorSchema } from './schema';
import { execSync } from 'child_process';

export default async function runExecutor(options: HerokuDeployExecutorSchema) {
  const cwd = options.distLocation;
  execSync(`heroku container:login`, { cwd });
  execSync(`heroku container:push web --app ${options.herokuAppName}`, { cwd });
  execSync(`heroku container:release web --app ${options.herokuAppName}`, {
    cwd,
  });
  return {
    success: true,
  };
}
```

11. Next we'll need to add a `deploy` target to our `apps/api/project.json` file:

```json
"deploy": {
    "executor": "@bg-hoard/internal-plugin:heroku-deploy",
    "outputs": [],
    "options": {
        "distLocation": "dist/apps/api",
        "herokuAppName": "nx-conf-2022-prep"
    },
    "dependsOn": [
        { "target": "build", "projects": "self", "params": "forward" }
    ]
},
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
      ```

⚠️ Normally, you want to restrict this to just a few origins. But to keep things simple in this workshop we'll enable it for all origins.
<br /> <br />

12. Now run the command to deploy your api!!

```shell
npx nx deploy api --prod
```

Because of how we set up our `dependsOn` for the `deploy` target, Nx will know that it needs to run (or pull from the cache if you already ran it) the production build of the api before then running the deploy!

13. Go to `https://<your-app-name>.herokuapp.com/api/games` - it should return you a list of games.
    <br /> <br />

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab20/LAB.md)
