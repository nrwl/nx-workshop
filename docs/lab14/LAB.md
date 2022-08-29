# 🧵 Lab 14 - Workspace generators - Modifying files

###### ⏰ Estimated time: 25-35 minutes

<br />

## 📚 Learning outcomes:

- **Explore some more advanced, real-world usages of generators**
- **Understand how to modify existing source code with generators**
  <br /><br /><br />

## 🏋️‍♀️ Steps :

1. Generate another generator called `update-scope-schema`
   <br /> <br />

2. As a start let's make it change the `defaultProject` from `store` to `api` in our `nx.json` file:

   <details>
   <summary>🐳 Hint</summary>

   - Refer to the [docs](https://nx.dev/devkit/index#updatejson)
   - Use this utility:
     - `import { updateJson } from '@nrwl/devkit';`
   - As always, the answer is in the [the solution](SOLUTION.md). Try a few different approaches on your own first.
   </details>

   ⚠️ When you run the above, it might complain that you haven't supplied a `name`. Since
   we don't need this property in the generate, you can remove it from the schema.
   <br /> <br />

3. Now that we had some practice with the `updateJson` util - Let's build something even more useful:

   - When large teams work in the same workspace, they will occasionally be adding new projects and hence, **new scope tags**
   - We want to make sure that scope tags specified in our `util-lib` generator are up to date and take into account all these new scopes that teams have been adding
   - We want to check if there is a new scope tag in any of our `project.json` files and update our generator schema
   - We can use the [`getProjects`](https://nx.dev/devkit/index#getprojects) util to read all the projects at once.
   - **BONUS:** Modify your generator so it fetches list of scopes from all the `project.json` files and updates the schema in util-lib with any new ones

   ⚠️ You can use the function provided in the Hint to extract the `scopes`

   <details>
   <summary>🐳 Hint</summary>

   ```typescript
   function getScopes(projectMap: Map<string, ProjectConfiguration>) {
     const projects: any[] = Array.from(projectMap.values());
     const allScopes: string[] = projects
       .map((project) =>
         project.tags
           // take only those that point to scope
           .filter((tag: string) => tag.startsWith('scope:'))
       )
       // flatten the array
       .reduce((acc, tags) => [...acc, ...tags], [])
       // remove prefix `scope:`
       .map((scope: string) => scope.slice(6));
     // remove duplicates
     return Array.from(new Set(allScopes));
   }
   ```

   </details>

   <br />

4. It's good practice to have your generator run your modified files through Prettier after modifying them. You might already have this, but just in case you removed it:

   - Use `import { formatFiles } from '@nrwl/devkit';`
   - `await` this at the end of your generator
     <br /> <br />

5. `index.ts` also has a `Schema` interface that should be updated. For modifying files that are not JSON we will use `host.read(path)` and `host.write(path, content)` methods.

   ⚠️ You can use the function provided in the Hint to replace the `scopes`

   <details>
   <summary>🐳 Hint</summary>

   ```typescript
   function replaceScopes(content: string, scopes: string[]): string {
     const joinScopes = scopes.map((s) => `'${s}'`).join(' | ');
     const PATTERN = /interface Schema \{\n.*\n.*\n\}/gm;
     return content.replace(
       PATTERN,
       `interface Schema {
     name: string;
     directory: ${joinScopes};
   }`
     );
   }
   ```

   </details>
   <br />

6. So we can test our changes, create a new app and define a scope for it.

     <details>
   <summary>🐳 Hint</summary>

   ```shell
   nx generate app vide-games --tags=scope:vide-games
   ```

   </details>
   <br />

7. Run your generator and notice the resulting changes. Commit them so you start fresh on your next lab.
   <br /> <br />

8. **BONUS** - As a bonus, if project doesn't have `scope` tag defined, we will assume it's the first segment of the name (e.g `admin-ui-lib` -> `scope:admin`) and we will go ahead and set one for it.
   <br /> <br />

9. **BONUS BONUS** - use a tool like [Husky](https://typicode.github.io/husky/#/) to run your
   generator automatically before each commit. This will ensure developers never forget to add
   their scope files.
   <br /> <br />

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab15/LAB.md)
