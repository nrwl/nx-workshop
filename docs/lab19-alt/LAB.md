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
   You can move your `SURGE_TOKEN` variable to the root, so it can be shared among your projects. [READ MORE](https://nx.dev/latest/react/guides/environment-variables#loading-environment-variables)
   
4. Try to deploy both apps and check if they still work.

5. Commit everything before moving on to the next lab

5. **BONUS** - Create a custom workspace generator that adds a `"deploy"` target for a frontend project, so that we don't have
to manually re-do the steps in [Lab 18](../lab18/LAB.md) each time.

6. **BONUS** - Create a new React or Angular frontend app, and test your above schematic

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab20-alt/LAB.md)
