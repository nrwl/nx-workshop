##### Generate a new run-commands config:

```shell
nx generate run-commands deploy --project=store --command="surge dist/apps/store https://<chose-some-unique-url-123>.surge.sh --token <your-surge-token>"
```

##### Deploy the store via Nx

```shell
nx deploy store
```

##### Building the store for production

```bash
nx build store --configuration production
```

##### The full deploy executor configuration

```json
"deploy": {
  "executor": "@nrwl/workspace:run-commands",
  "outputs": [],
  "options": {
    "command": "surge dist/apps/store ${SURGE_DOMAIN_STORE} --token ${SURGE_TOKEN}"
  }
}
```
