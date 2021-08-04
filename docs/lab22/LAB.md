# 💈 Lab 22 - Deploying only what changed

###### ⏰ Estimated time: 20-25 minutes
<br />

## 📚 Learning outcomes:

- **Explore an advanced example of `nx affected` by deploying only the affected apps on the master branch**
- **Understand how to configure the `base` commit for `nx affected` in a CD scenario**
<br /><br /><br />

## 🏋️‍♀️ Steps :

In the previous labs we set up automatic deployments. But everytime we push to master, we're always building and running the deployment scripts for ALL the apps in our workspace. As our repo grows, this is not scalable. We only want to build and deploy the apps that have actually changed, and need re-deploying.

1. Update your `deploy.yml` file so that it builds only the affected apps, and it deploys only the affected apps
    
    ⚠️ You can compare against the previous commit for now: `--base=HEAD~1`
    <br /> <br />

2. If you haven't already, ensure you run your "affected" commands in parallel
   <br /> <br />

3. Commit everything
   <br /> <br />
4. Now make a change just to the `store`. Maybe update the title again
    - Commit and push
    - Inspect your workflow on the GitHub actions tab - it should only be building and deploying 
    whatever changed **in the last commit**: only the Store.
    <br /> <br />

---

⛔ The problem now is that it's always comparing against the last commit:

- Let's say I make some changes to the API (or AdminUI) over a few commits - and I don't push them. 
- Then I make one small change to the Store, commit it, and push to master. 
- Even though **I've pushed lots of commits with changes to both the Store and the API** (or AdminUI), because our CD Workflow is only
  looking at the last commit, **it will only deploy the Store.** 👎

    <details>
    <summary>There is also the problem of potential failures 🧨</summary>

    Now our setup is simple: it just builds.
    But let's say we wanted to run the E2E tests again before deploying - just to be extra safe!
    In that case, if I change the API (or AdminUI) and push, the E2E tests might fail. So API (or AdminUI) will not get deployed.
    I then fix the E2E tests, but because the API (or AdminUI) does not depend on its E2E tests, `nx affected` will not mark it for deployment.
    So even though we changed the API (or AdminUI), it did not get deployed.
    </details>

💡 Solution: **last successful commit!**
- If we constantly compare against **the last commit where all the affected apps got succesfully deployed** - we 
will never miss a deployment
- In our case, "successfully deployed" means when our `deploy.yml` workflow completes without errors. That's a succesful commit!
- Getting the last successful commit is different on each platform:
    - [Netlify has the `CACHED_COMMIT_REF`](https://docs.netlify.com/configure-builds/environment-variables/#git-metadata)
    - On CircleCI, we can use the `<< pipeline.git.base_revision >>`
    - For GitHub actions, we can use the `nrwl/nx-set-shas` action

---

5. Right after the `npm-install` step, let's trigger the action to get the last successful commit:

    ```yml
    - uses: bahmutov/npm-install@v1
    - uses: nrwl/nx-set-shas@v2
    ```
    <br />
    
6. You can now use the output from the above action in your affected commands:

    ```bash
    --base=${{ env.NX_BASE }}
    ```
    <br />

7. By default, the `actions/checkout@v2` action only fetches the last commit (for efficiency). But since we now might want to compare against a larger range of commits, we need to tell it to fetch more:
   
    ```yaml
    - uses: actions/checkout@v2
      with:
        fetch-depth: 0
    ```
    <br />

8. Commit everything and push. Let it build. It should compare against the immediately previous commit (because your workflow ran against it, and it passed)
   <br /> <br />

9. Try to go through one of the problematic scenarios described above. It should now work, and it should build both the API (or AdminUI) and the Store (instead of just the Store)

  > Let's say I make some changes to the API (or AdminUI) over a few commits - and I don't push them. Then I make one small change to the Store, commit it, and push to master.
  Even though I've pushed lots of commits with changes to both the Store and the API (or AdminUI), because our CD Workflow is only looking at the last commit, it will only deploy the Store.
  <br />

---

🎓If you get stuck, check out [the solution](SOLUTION.md)
