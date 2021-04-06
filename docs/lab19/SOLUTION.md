##### Creating an API builder

```shell
nx generate run-commands deploy --project=api --cwd="dist/apps/api"
```

##### The full deploy config for the API

```
"deploy": {
    "executor": "@nrwl/workspace:run-commands",
        "outputs": [],
        "options": {
        "commands": [
            "cp ../../../apps/api/Dockerfile .",
            "heroku container:login",
            "heroku container:push web -a <the name of your Heroku App>",
            "heroku container:release web -a <the name of your Heroku App>"
        ],
        "cwd": "dist/apps/api",
        "parallel": false
    }
},
```
