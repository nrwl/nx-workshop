### 💻 Lab 21 - Setting up CD for automatic deployment

###### ⏰ Estimated time: 5-10 minutes

#### 📚 Learning outcomes:

- Understand how to bootstrap a new Nx workspace

#### 🏋️‍♀️ Steps :

1. Add a `.github/workflows/deploy.yml` file:

```
name: Deploy Website

on:
  push:
    branches:
      - main

env:
  SURGE_DOMAIN: ${{ secrets.SURGE_DOMAIN }}
  SURGE_TOKEN: ${{ secrets.SURGE_TOKEN }}
  HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}

jobs:
  build:
    runs-on: ubuntu-latest
    name: Deploying apps
    steps:
      - uses: actions/checkout@v2.3.4
      - uses: bahmutov/npm-install@v1.4.5
      - run: npm run nx build store -- --configuration=production
      - run: npm run nx build api -- --configuration=production
      - run: npm run nx deploy store
      - run: npm run nx deploy api
```

2. Let's add our secrets that we kept in `.local.env` files to GitHub:
    1. Go to your GitHub workshop fork
    2. "Settings" at the top
    3. "Secrets" (on the left menu bar)
    4. Add values for:
        1. SURGE_DOMAIN
        2. SURGE_TOKEN
        3. HEROKU_API_KEY
    
    ![GitHub secrets](./github_secrets.png)

3. Since we'll be re-deploying, we want to test if we're looking at a new version of our code:
    - Make a change to your API (maybe change the name of one of the games)
    - Make a change to your store (maybe change the title in the header) 
3. Commit everything locally on `master` and then push
4. You should see your new workflow start up
5. Once it's done, navigate to your Surge deployment URL and test if you notice the new changes

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab13/LAB.md)
