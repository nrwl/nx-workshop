### 💻 Lab 1 - Setting up CI

###### ⏰ Estimated time: 5-10 minutes

#### 📚 Learning outcomes:

- Understand how to bootstrap a new Nx workspace

#### 🏋️‍♀️ Steps :

1. Let's make sure the master branch is up to date

If you are on `master` - commit everything:
```
git add . && git commit -m "finished lab 14"
```

If you are on a different branch, commit everything, switch to master
and bring it up to date:

```
git add . && git commit "finish lab 14"
git checkout master
git merge previous-branch-you-were-on
```

2. Create a new file `.github/workflows/ci.yml`

```
name: Run CI checks

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    name: Testing affected apps
    steps:
      - uses: actions/checkout@v1
      - uses: bahmutov/npm-install@v1.4.5
      - run: npm run nx test store
      - run: npm run nx test api
```

3. Create and switch to a new branch:

```
git add . && git commit -m "add ci"
git checkout -b dynamic-title
```

4. Open `apps/store/src/app/app.component.html`
5. And make the title of the header dynamic:

```
<bg-hoard-header [title]="title"></bg-hoard-header>
```

6. Commit all your changes and push your new branch
7. Go to GitHub and make a Pull Request to `master`
8. After a few moments you'll see something like this:
    ![GitHub Actions example](./github_actions.png)
9. The unit tests will be failing - that's expected.

---

But now we're testing both projects - even though we only changed the store.

---

10. Let's use `nx affected` to only test the changed projects:

```
name: Run CI checks

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    name: Testing affected apps
    steps:
      - uses: actions/checkout@v1
      - uses: bahmutov/npm-install@v1.4.5
      - run: npm run nx affected -- --target=test --base=origin/master --parallel
```

11. Commit and push - on your Github Actions log - you should see only the `store` tests running.
12. Let's add some more checks to our CI:

```
name: Run CI checks

on: [pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    name: Building affected apps
    steps:
      - uses: actions/checkout@v1
      - uses: bahmutov/npm-install@v1.4.5
      - run: npm run nx affected -- --target=build --base=origin/master --parallel
  test:
    runs-on: ubuntu-latest
    name: Testing affected apps
    steps:
      - uses: actions/checkout@v1
      - uses: bahmutov/npm-install@v1.4.5
      - run: npm run nx affected -- --target=test --base=origin/master --parallel
  lint:
    runs-on: ubuntu-latest
    name: Linting affected apps
    steps:
      - uses: actions/checkout@v1
      - uses: bahmutov/npm-install@v1.4.5
      - run: npm run nx affected -- --target=lint --base=origin/master --parallel
  e2e:
    runs-on: ubuntu-latest
    name: E2E testing affected apps
    steps:
      - uses: actions/checkout@v1
      - uses: bahmutov/npm-install@v1.4.5
      - run: npm run nx affected -- --target=e2e --base=origin/master --parallel
```

13. Commit and push
14. You'll notice some steps, like test and e2e, are still failing. We will fix them later.
15. For now, you can merge your PR into master 
16. Switch to master locally and pull latest so you will the changes from the PR that was merged in

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab16/LAB.md)
