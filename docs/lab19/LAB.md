### 🧲 Lab 19 - Deploying the API

###### ⏰ Estimated time: 30 minutes

#### 📚 Learning outcomes:

- Explore more advanced usages of the "run-commands" builder
- Go through an example of how to deploy an API to Heroku through Nx

#### 🏋️‍♀️ Steps :

1. For this workshop you'll need two CLI tools installed:
    - [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
        - Verify installation via: `heroku --version`
    - [Docker](https://www.docker.com/get-started)
        - Verify via `docker --version`

3. Let's prepare Heroku to deploy our API:

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

5. Let's setup our ENV variables from the beginning now
 
    `apps/api/.local.env`

    ```
    HEROKU_API_KEY=<your-heroku-token>
    ```

6. Create a new file `apps/api/Dockerfile`

    ```
    # use a Node v12 based image
    FROM node:12-alpine
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

6. If you `nx build api` right now
    - 👍 Then `cd dist/apps/api && node main.js`
    It should work. Because it has access to `node_modules`
    - 👎 If you copy your built sources to some other folder on your file system.
    And then try to `node main.js` in that folder that doesn't hace access to `node_modules` - it will fail 

    💡 By default, dependencies of server projects are not bundled together, as opposed to your Angular apps.
    If curious why, you can [read more here](https://github.com/nestjs/nest/issues/1706#issuecomment-579248915).

7. Let's fix the above - In `workspace.json`, under the **production** build options for the API (`projects -> api -> architect -> build -> configurations -> production`)
add this as an option:

    ```
    "externalDependencies": [
        "@nestjs/microservices",
        "@nestjs/microservices/microservices-module",
        "@nestjs/websockets/socket-module",
        "class-transformer",
        "class-validator",
        "cache-manager"
    ],
    ```
   
   <details>
   <summary>❓ What does this do?</summary>
   
   The above option tells webpack to bundle ALL the dependencies our API requires inside `main.js`, except the ones above (which fail the build if we tell webpack to include, because they're lazily loaded).
   Normally, it's not recommended to bundle any dependencies with your server bundles,
   but in this case it simplifies the deployment process.
   </details>

8. Use the `@nrwl/workspace:run-commands` schematic to generate another "deploy" target:
    - This time for the `api` project
    - Use the [`--cwd` option](https://nx.dev/latest/angular/plugins/workspace/schematics/run-commands#cwd)
    to ensure all commands execute in the `dist/apps/api` folder
    - Leave the "command" blank for now


9. Let's customise the generated "deploy" config a bit

    Go to `workspace.json` and add the commands that we'll need to run:
    ```
    "deploy": {
        "builder": "@nrwl/workspace:run-commands",
            "outputs": [],
            "options": {
            "commands": [ <--- ADD THESE COMMANDS
                "cp ../../../apps/api/Dockerfile .",
                "heroku container:login",
                "heroku container:push web -a <the name of your Heroku App>",
                "heroku container:release web -a <the name of your Heroku App>"
            ],
            "cwd": "dist/apps/api"
        }
    },
    ```
   
10. By default, if you give a list of commands to `run-commands`, it will run them in parallel.
In our case, we want them to run one after another.
**See if you can add a configuration option to make them run in parallel**

9. Let's enable CORS on the server so our API can make requests to it (since they'll be deployed in separate places):
    - In `apps/api/src/main.ts`
    - Enable CORS:
        ```
        async function bootstrap() {
            const app = await NestFactory.create(AppModule);
            const globalPrefix = 'api';
            app.setGlobalPrefix(globalPrefix);
            app.enableCors(); <--- ADD THIS
        ```
   
   ⚠️ Normally, you want to restrict this to just a few origins. But to keep things simple in this workshop
   we'll enable it for all origins.
   
10. Use Nx to build the API for production, and then deploy it!

    ⚠️ Note: On Windows, the deploy will fail. Create a separate `deploy-windows` architect, as we did in the previous lab, but use this for the copy command:

    ```
    "commands": [
        "xcopy \"..\\..\\..\\apps\\api\\Dockerfile\" .",
        ....
    ```

11. Go to `https://<your-app-name>.herokuapp.com/api/games` - it should return you a list of games.

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab20/LAB.md)
