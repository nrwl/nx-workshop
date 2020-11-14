### 💻 Lab 16 - Distributed caching

###### ⏰ Estimated time: 5-10 minutes

#### 📚 Learning outcomes:

- Understand how to bootstrap a new Nx workspace

#### 🏋️‍♀️ Steps :

1. Earlier in the workshop, we discussed about local caching. Let's enable distributed caching.
    ```
   yarn add @nrwl/nx-cloud
   nx generate @nrwl/nx-cloud:init
   ```
   
   ![Nx Cloud Confirmation](./nx_cloud_enabled.png)
2. Inspect the changes added in `nx.json` - especially the access token - we'll get back to that in a bit
3. Important: Make sure, at this stage, you commit and push your changes:

```
# make sure you're on master
git checkout master
git add . && git commit -m "add nx cloud"
git push origin master
```

4. Run a build: `nx run-many --target=build --all`
    - it will a few seconds
5. You'll see a link at the end, let's see what's there:
    ![Run Details Link](./run_details.png)
    
    We'll talk more about these links later!
    
6. Try to build all projects again: `nx run-many --target=build --all`
    - It should finish much quicker this time - because it just pulled from the local cache!
7. Let's try something different now - in a different folder on your machine, let's try and do a **fresh** of your repository:

```
git clone git@github.com:<your-username>/<your-repo>.git test-distributed-caching
cd test-distributed-caching
yarn
```

8. In your new instance, let's try and build again: `nx run-many --target=build --all`
9. You have no local cache - because we did a fresh pull of the repository. But it should pull from the NxCloud cache:

![NxCloud cache pull](./distrib_caching_confirmation.png)

10. Go back to your main repository

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab17/LAB.md)
