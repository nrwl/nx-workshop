##### The complete tags in your nx.json:

```json
"projects": {
    "store": {
      "tags": ["scope:store", "type:app"]
    },
    "store-e2e": {
      "tags": ["scope:store", "type:e2e"],
      "implicitDependencies": [
        "store"
      ]
    },
    "store-ui-shared": {
      "tags": ["scope:store", "type:ui"]
    },
    "store-util-formatters": {
      "tags": ["scope:store", "type:util"]
    },
    "store-feature-game-detail": {
      "tags": ["scope:store", "type:feature"]
    },
    "api": {
      "tags": ["scope:api", "type:app"]
    },
    "util-interface": {
      "tags": ["scope:shared", "type:util"]
    },
    "store-ui-shared-e2e": {
      "tags": ["scope:store", "type:e2e"],
      "implicitDependencies": [
        "store-ui-shared"
      ]
    }
  }
```

##### nx-enforce-module-boundaries rules:

```json
"depConstraints": [
          {
            "sourceTag": "scope:store",
            "onlyDependOnLibsWithTags": ["scope:store", "scope:shared"]
          },
          {
            "sourceTag": "scope:api",
            "onlyDependOnLibsWithTags": ["scope:api", "scope:shared"]
          },
          {
            "sourceTag": "type:feature",
            "onlyDependOnLibsWithTags": ["type:feature", "type:ui", "type:util"]
          },
          {
            "sourceTag": "type:ui",
            "onlyDependOnLibsWithTags": ["type:ui", "type:util"]
          },
          {
            "sourceTag": "type:util",
            "onlyDependOnLibsWithTags": ["type:util"]
          }
        ]
```
