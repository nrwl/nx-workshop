### 💻 Lab 19 - Deploying the API

###### ⏰ Estimated time: 5-10 minutes

#### 📚 Learning outcomes:

- Understand how to bootstrap a new Nx workspace

#### 🏋️‍♀️ Steps :

1. For this workshop you'll need Docker and the Heroku CLI installed (Docker is optional - it's only if you want to trigger the deployment locally)

3. Run these commands:

```
heroku login
heroku create <choose-some-unique-name for your api>
heroku authorizations:create <-- remember the "Token" this outputs
```

4. Keep track of the "Token" you got from the above command - we'll use this to login to Heroku from now on.
Also keep track of the unique name you gave to your Heroku API. This will determine the address where the API will 
     be deployed to as well, for example `https://<your-app-name>.herokuapp.com`
5. Create a new file `apps/api/.local.env`

```
HEROKU_API_KEY=<your-heroku-token>
```

6. Create a new file `apps/api/Dockerfile`

```
FROM node:12-alpine
WORKDIR /app
COPY ./ ./
CMD node main.js
```

7. In `workspace.json`, under the **production** build options for the API (`projects -> api -> architect -> build -> configurations -> production`)
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

The above option tells webpack to bundle all the dependencies with our API, except the ones above (which fail the build if we tell webpack to include).
Normally, it's not recommended to bundle any dependencies with your server bundles,
but in this case it simplifies the deployment process.

8. Add a new "deploy" architect to the "api" this time:

`nx generate run-commands deploy --project=api --cwd="dist/apps/api"`

Leave the command field blank.

Go to `workspace.json` and add a few more options to it:
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
        "cwd": "dist/apps/api",
        "parallel": false <---- ADD THIS
    }
},
```

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
   
   Normally, you want to restrict this to just a few origins. But to keep things simple in this workshop
   we'll enable it for all origins.
   
10. Run:

```
nx build api --configuration=production
nx deploy api
```

Note: On Windows, the deploy will fail. Create a separate `deploy-windows` architect, as we did in the previous lab, but use this for the copy command:

```
"commands": [
    "xcopy \"..\\..\\..\\apps\\api\\Dockerfile\" .",
    ....
```

11. Go to `https://<your-app-name>.herokuapp.com/api/games` - you should see a list of games.


//TODO briefly talk about outputs here
---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab20/LAB.md)
