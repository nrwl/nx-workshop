### 💻 Lab 22 - Deploying only what changed

###### ⏰ Estimated time: 5-10 minutes

#### 📚 Learning outcomes:

- Understand how to bootstrap a new Nx workspace

#### 🏋️‍♀️ Steps :

1. Let's deploy only what's been affected now:

```
name: Deploy Website

on:
  push:
    branches:
      - master

env:
  SURGE_DOMAIN: ${{ secrets.SURGE_DOMAIN }}
  SURGE_TOKEN: ${{ secrets.SURGE_TOKEN }}
  HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}

jobs:
  build:
    runs-on: ubuntu-latest
    name: Deploying apps
    steps:
      - uses: actions/checkout@v1
      - uses: bahmutov/npm-install@v1.4.5
      - uses: rarmatei/last-successful-commit-action@v8
        id: last_successful_commit
        with:
          branch: 'master'
          workflow_id: 'deploy.yml'
          github_token: ${{ secrets.GITHUB_TOKEN }}
      - run: npm run nx affected -- --target=build --base=${{ steps.last_successful_commit.outputs.commit_hash }} --parallel --configuration=production
      - run: npm run nx affected -- --target=deploy --base=${{ steps.last_successful_commit.outputs.commit_hash }} --parallel
```

---

🎓If you get stuck, check out [the solution](SOLUTION.md)
