# 🔍 Lab 17 - NxCloud GitHub bot

###### ⏰ Estimated time: 10 minutes
<br />

## 📚 Learning outcomes:

- **Explore the NxCloud Run-Detail pages**
- **Configure the NxCloud bot to get easy to read reports on the Nx checks performed during CI**
<br /><br /><br />

## 🏋️‍♀️ Steps :

1. **Enable the NxCloud GitHub bot** on your GitHub repository: [https://github.com/apps/nx-cloud](https://github.com/apps/nx-cloud)
   <br /> <br />
2. Switch to a new branch: `git checkout -b nxcloud-bot`
   <br /> <br />

3. Make a change (add a `console.log`) in the store: `apps/store/src/app/app.component.ts` (so that it will trigger our affected commands in CI):

    ```
    export class AppComponent {
      constructor(private http: HttpClient) {
        console.log("component constructed") <-- add console log
      }
    ```

   <br /> <br />

4. Commit everything and push your branch
   <br /> <br />
5. Make a PR on GitHub
   <br /> <br />
6. Once the checks finish you should see something similar to this:

    ![NxCloud Bot](./nx_cloud_bot.png)
    <br />

   If your install is failing with `@storybook/angular` add following to the root `package.json`:

   ```
   "overrides": {
     "@storybook/angular": {
       "zone.js": "0.12.0"
     }
   }
   ```
    
7. Click on one of the "failed" commands (if any). On the "Run Details" page, click on one of the projects and inspect the terminal output:

    ![Nx Cloud project](./nx-cloud-projects.png)
    
    🔥 Rather than reading through CI logs, you can use this view to filter to the failed projects and inspect the failure reason scoped to that project.

    <br /> <br />
    
8. Have a look at the "Cache Hit" and "Cache Miss" filters. What do you think they do?

    ![Cache hit/miss](./cache_hit_miss.png)
    <br />
    
9. Finally, you should see a "Claim workspace" button at the top - it's a good idea to do that at this stage. We'll explain more about that in a bit!
   <br /> <br />

10. Merge your PR into master and pull latest locally:

    ```
    git checkout master
    git pull
    ```
    <br />

11. **BONUS**: [Have a look at some of the docs](https://nx.dev/nx-cloud/set-up/set-up-dte#ci/cd-examples) for setting up NxCloud on CI to see how the set-up might apply to your CI provider.
12. **BONUS**: Read [this blog post](https://nx.dev/concepts/dte) on "Distributed Task Execution". We'll briefly talk about this after the lab.

---

[➡️ Next lab ➡️](../lab18/LAB.md)
