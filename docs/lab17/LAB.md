### 💻 Lab 1 - NxCloud GitHub bot

###### ⏰ Estimated time: 5-10 minutes

#### 📚 Learning outcomes:

- Understand how to bootstrap a new Nx workspace

#### 🏋️‍♀️ Steps :

1. Enable the NxCloud GitHub bot on your repository: [https://github.com/apps/nx-cloud](https://github.com/apps/nx-cloud)
2. Switch to a new branch
3. Add these env variable to your GitHub actions config:

```
name: Run CI checks

on: [pull_request]

env:
  NX_BRANCH: ${{ github.event.number }}
  NX_RUN_GROUP: ${{ github.run_id }}

jobs:
  build:
    ......
```

4. Make a change in the store: `apps/store/src/app/app.component.ts` (so that it will trigger our affected commands in CI)

```
export class AppComponent {
  constructor(private http: HttpClient) {
    console.log("component constructed")
  }
```

5. Commit everything and push your branch
6. Make a PR on GitHub
7. Once the checks finish you should see:

![NxCloud Bot](./nx_cloud_bot.png)

8. Merge your PR into master and pull latest locally:

```
git checkout master
git pull
```

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab18/LAB.md)
