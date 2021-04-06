### 🧵 Lab 14 - Workspace generators - Modifying files

###### ⏰ Estimated time: 25-35 minutes

#### 📚 Learning outcomes:

- Explore some more advanced, real-world usages of generators
- Understand how to modify existing source code with generators

#### 🏋️‍♀️ Steps :

1. Generate another generator called `sort-project-references`

2. As a start let's make it change the `defaultProject` from `store` to `api` in our workspace.json` file:

   <details>
   <summary>🐳 Hint</summary>

    - Refer to the [docs](https://nx.dev/latest/angular/core-concepts/nx-devkit#nx-devkit)
    - Use this utility: 
        - `import { updateJson } from '@nrwl/devkit';`
    - As always, the answer is in the [the solution](INC-VERSION-SOLUTION.md). Try a few different approaches on your own first. 
   </details>
   
   ⚠️ When you run the above, it might complain that you haven't supplied a `name`. Since
   we don't need this property in the generate, you can remove it from the schema.

3. Now that we had some practice with the `updateJson` util - Let's build something even more useful:
    - When large teams work in the same workspace, they will occasionally be adding new libs in their PRs
    - Because these libs get added at the end of our `workspace.json` projects list, they can be a source of merge conflicts. All these PRs will be modifying the same file
    - If there was an easy way developers could sort the `projects` list in their `workspace.json` file before pushing the PR - it would reduce the chance of a merge conflict, as the changes would happen
    at different places in the file.
    
    **Modify your generator so it sorts the value of `projects` in `workspace.json` by key**.
    
    ⚠️ You can use the function provided in the Hint to sort the keys of an object
    
   <details>
   <summary>🐳 Hint</summary>

    ```typescript
    function sortObjectKeys(obj: any) {
      const sorted = {};
      Object.keys(obj).sort().forEach(key => {
        sorted[key] = obj[key];
      });
      return sorted;
    }
    ```
     
   </details>

2. `nx.json` also has a `projects` property vulnerable to merge conflicts. Let's sort it as well part of our above generator.

3. Optional step: it's good practice to have your generator run your modified files through Prettier after modifying them. You might already have this, but just in case you removed it:

    - Use `import { formatFiles } from '@nrwl/devkit';`
    - `await` this at the end of your generator

4. Run your generator and notice the resulting changes. Commit your changes so you start fresh on your next lab.

5. **BONUS** - If you finish early, open up `tsconfig.base.json`

    You'll notice its `compilerOptions/paths` property also contains all the projects in our
    workspace. Try to sort this as well as part of your generator.
    
    Another one you can look at is the root `jest.config.js` - this will be interesting as it's a `.js` file.

6. **BONUS BONUS** - use a tool like [Husky](https://typicode.github.io/husky/#/) to run your
generator automatically before each commit. This will ensure developers never forget to sort
their workspace files.

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab15/LAB.md)
