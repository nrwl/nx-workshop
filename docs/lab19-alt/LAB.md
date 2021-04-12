### 🧲 Lab 19 Alternative - Creating and deploying a 2nd frontend

###### ⏰ Estimated time: 15-20 minutes

#### 📚 Learning outcomes:

- Recap what you've learned about generating apps and creating custom executors with "run-commands"

#### 🏋️‍♀️ Steps :

In this lab, we'll practice generating a 2nd frontend, using React. This is in preparation for the next few labs, where we'll
deploying the two frontends independently in our GitHub Actions based Continous Deployment setup.

1. We want to build a new Admin UI for out store. But we'll use React as our framework of choice. 
   **Generate a new React app called "admin-ui"**
   You can use any configuration options you want.

   ⚠️ There will be fewer hints in this lab, but you can always use the [solution](SOLUTION.md) as a last resort.
   
2. We won't make any changes to it. Let's serve it to see if it looks okay locally.

3. **Now let's build it for production**. Since we added a lot of files, also commit our changes.

3. Following the same steps as [Lab 18](../lab18/LAB.md), add a `"deploy"` target to it.
   
   ⚠️ Hint: You can have a `.local.env` at the root of your workspace as well, for any variables that need to be shared.
   You can move your `SURGE_TOKEN=<your-surge-token>` variable to the root, so it can be shared among your projects. [READ MORE](https://nx.dev/latest/react/guides/environment-variables#loading-environment-variables)
   
4. Test your changes look okay at the deployed URL.

5. Notice how both our frontends are pointing to the same `SURGE_DOMAIN` env variable. If we want to set up a GitHub Workflow that deploys them at two
   separate domains, we'll need to refer to each domain separately:
  - In `apps/admin-ui/.local.env`, rename `SURGE_DOMAIN` to `SURGE_DOMAIN_ADMIN_UI`
  - Update `workspace.json --> admin-ui --> deploy` target to point to this new var
  - Repeat the steps above for the `store` project

4. Try to deploy both apps again and check if it still works.

5. Commit everything before moving on to the next lab

5. BONUS - Create a custom workspace generator that adds a `"deploy"` target for a frontend project, so that we don't have
to manually re-do the steps in [Lab 18](../lab18/LAB.md) each time.

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab20-alt/LAB.md)
