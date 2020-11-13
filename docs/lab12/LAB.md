### 💻 Lab 12 - Module boundaries

###### ⏰ Estimated time: 5-10 minutes

#### 📚 Learning outcomes:

- Understand project scopes, types and how to set boundaries between them

#### 🏋️‍♀️ Steps :

1. Open `nx.json` and tag the apps accordingly:

```
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

2. Open the root `tslint.json`, find the `"nx-enforce-module-boundaries"` rule and set the `depConstraints`:

```
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

3. Run `nx run-many --target=lint --all --parallel`

4. Try to import a feature in a UI lib
    - In: `libs/store/ui-shared/src/lib/store-ui-shared.module.ts`
    - Import: `import { StoreFeatureGameDetailModule } from '@bg-hoard/store/feature-game-detail';`

5. Run linting again: `nx run-many --target=lint --all --parallel`
6. You should see an error - you can now delete the import.
7. Try to import a `store` lib from an `api` scope:
    - in `apps/api/src/app/app.service.ts`
    - Import: `import { formatRating } from '@bg-hoard/store/util-formatters';`
8. `nx run-many --target=lint --all --parallel`
9. You should see an error - you can now delete the import.

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab13/LAB.md)
