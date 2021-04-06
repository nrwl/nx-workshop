### 💈 Lab 22 - Deploying only what changed

###### ⏰ Estimated time: 20-25 minutes

#### 📚 Learning outcomes:

- Explore an advanced example of `nx affected` by deploying only the affected apps on the master branch
- Understand how to configure the `base` commit for `nx affected` in a CD scenario

#### 🏋️‍♀️ Steps :

In the previous labs we set-up automatic deployments.
But everytime we push to master, we're always building and running the
deployment scripts for ALL the apps in our workspace.
As our repo grows, this is not scalable. We only want to build 
and deploy the apps that have actually changed, and need re-deploying.

1. Update your `ci.yml` file so that it builds only the affected apps, and it deploys only the affected apps
    
    ⚠️ You can compare against the previous commit for now: `--base=HEAD~1`

2. If you haven't already, ensure you run your "affected" commands in parallel

3. Commit everything
4. Now make a change just to the `store`. Maybe update the title again
    - Commit and push
    - Inspect your workflow on the GitHub actions tab - it should only be building and deploying 
    whatever changed **in the last commit**: only the Store.

---

⛔ The problem now is that it's always comparing against the last commit:

- If I change the API over a few commits, and then in the last commit
before I push I change the Store, it will deploy just the Store. Even though 
the API changed as well    
- There is also the problem of failures. Now our setup is simple: it just builds.
But let's say we wanted to run the E2E tests again before deploying - just to be extra safe!
In that case, if I change the API and push, the E2E tests might fail. So API will not get deployed.
I then fix the E2E tests, but because the API does not depend on its E2E tests, `nx affected` will not mark it for deployment. 
So even though we changed the API, it did not get deployed.

💡 Solution: **last successful commit!**
- If we constantly compare against the previous point where all the affected apps got succesfully deployed - we 
will never miss a deployment
- In our case, "succesfully deployed" means when our `deploy.yml` workflow completes without errors. That's a succesful commit!
- Getting the last succesful commit is different on each platform:
    - [Netlify has the `CACHED_COMMIT_REF`](https://docs.netlify.com/configure-builds/environment-variables/#git-metadata)
    - On CircleCI, we can use the `<< pipeline.git.base_revision >>`
    - Some CI platforms don't even provide it all
    - For GitHub actions, we can use the `nrwl/last-successful-commit-action` action

---

1. Right after the `npm-install` step, let's trigger the action to get the last successful commit:

    ```
    - uses: bahmutov/npm-install@v1.4.5
    - uses: nrwl/last-successful-commit-action@v1
      id: last_successful_commit
      with:
          branch: 'master' <-- get the last successful commit on master
          workflow_id: 'deploy.yml' <-- use the deploy.yml workflow as the definition for "success"
          github_token: ${{ secrets.GITHUB_TOKEN }} <-- we'll need to pass it a special GitHub auth token, so it can query the GitHub API for our repo
    ```

    ⚠️ Don't worry about defining the `GITHUB_TOKEN` secret. It's already available by default.
    
2. You can now use the output from the above action in your affected commands:

    ```
    --base=${{ steps.last_successful_commit.outputs.commit_hash }}
    ```

3. Commit everything and push. Let it build.

4. Try to go through the scenario described above and test if it is now covered by the changes we just made:

    > If I change the API over a few commits, and then in the last commit
      before I push I change the Store, it will deploy just the Store. Even though 
      the API changed as well

---

🎓If you get stuck, check out [the solution](SOLUTION.md)
