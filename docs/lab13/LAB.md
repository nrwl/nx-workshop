# 🧸️ Lab 13 - Workspace Plugins and Generators - Intro

###### ⏰ Estimated time: 20-25 minutes

<br />

## 📚 Learning outcomes:

- Understand what an internal plugin is
- Understanding generators in internal plugin, including:
  - How to create them
  - How to invoke them
  - How to use one to simplify usages of other, more powerful generators
    <br /><br /><br />

## 🏋️‍♀️ Steps :

We just learned how important tags are. But we don't want to constantly and manually
have to maintain them. In this workshop, we'll create an internal plugin called
`internal-plugin`, and create a `library generator` for this plugin that knows
about the folders in our workspace and automatically tags the new project with a correct
scope and type tag.

1.  Use the `@nrwl/nx-plugin:plugin` generator to generate a new plugin called
    `internal-plugin`.<br /> 
    Make sure that the `minimal` option is set.
    <br /> <br />

2.  Use the `@nrwl/nx-plugin:generator` generator to generate a new generator called
    `util-lib`.
    <br /> <br />

3.  Inspect the files that got generated and then commit everything.
    <br /> <br />

4.  Try to run your generator (you can append `--dry-run` to avoid reverting using Git)

    <details>
    <summary>🐳 Hint</summary>

    Run `npx nx list` to see your newly created plugin in the list of installed plugins:

    ```shell
    % npx nx list

    >  NX   Local workspace plugins:

        @bg-hoard/internal-plugin (generators)
    ```

    Run `npx nx list @bg-hoard/internal-plugin` to see our generator details:

    ```shell
    % npx nx list @bg-hoard/internal-plugin

    >  NX   Capabilities in @bg-hoard/internal-plugin:

      GENERATORS

      util-lib : util-lib generator
    ```

    You call generators from this local plugin using the same syntax you would with any plugin:

    ```shell
    nx generate <plugin name>:<generator name> [...options]
    ```

    </details>

    ⚠️ The code we generated creates a very bare-bones new library, with only a `project.json` and a `src/index.ts` file; you will see these files created if you run it.
     You can use Git to undo those changes (hence why it's recommended to commit before running a generator).
    <br /> <br />

5.  We can call other generators inside of our custom generator. Import the `@nrwl/workspace:library` generator and call it inside of the default exported function of `libs/internal-plugin/src/generators/util-lib/generator.ts`

    <details>
    <summary>🐳 Hint</summary>

    ```typescript
    import { libraryGenerator } from '@nrwl/workspace/generators';

    export default async function (tree: Tree, schema: UtilLibGeneratorSchema) {
      await libraryGenerator(tree, schema);
      // ...
    }
    ```
    </details>

6.  In `libs/internal-plugin/src/generators/util-lib/generator.ts` try to make it `console.log()` the value of the `--name` property you passed to it (can use `--dry-run` again to test it)
    <br /> <br />

7.  Now that we're more familiar with how command line options are passed to the generator,
    **let's revert all locally generated files**, as we're about to start making actually useful changes to the generator.
    <br /> <br />

8.  The generator should prefix any name you give to your lib with `util-`

    For example:

    - `nx generate @bg-hoard/internal-plugin:util-lib dates`
    - Should generate a lib with the name `util-dates`

    ⚠️ You can keep trying out your changes safely with the `--dry-run` flag.️
    <br /> <br />

9.  Add a new property to its schema called `directory`. It should have only 3 possible values:
    `"store", "api", "shared"`. If you do not pass `--directory` as an option when invoking the
    schema it should prompt the user to select from the 3 different values (similar to when you got
    asked about which CSS framework to use when creating Angular libs).

    <details>
    <summary>🐳 Hint</summary>

    [Adding dynamic prompts](https://nx.dev/recipe/generator-options#adding-dynamic-prompts)

    </details>
    <br />

10. The generator should generate the lib in the directory you pass to it.
    <br /> <br />

11. Because it's a `util` lib, it should automatically be generated with the `type:util` tags.

    <details>
    <summary>🐳 Hint</summary>

    Consult the `@nrwl/js:lib` [docs](https://nx.dev/packages/js/generators/library)
    for possible options you can pass to it.

    </details>
    <br />

12. We also need to add `scope` tag to it. We can use the `directory` value for this, since it signifies our scope.
    <br /> <br />

13. Before testing your changes, remember to commit them, in case you need to revert
    locally generated files again.
    <br /> <br />

14. Invoke your generator and test if the above requirements work

    - Let's give it the name `notifications`
    - Select `api` as the directory
      <br /> <br />

15. Let's add some functionality to the lib you just created:

    - In `libs/api/util-notifications/src/lib/api-util-notifications.ts`
    - Add:
      ```typescript
      export function sendNotification(clientId: string) {
        console.log('sending notification to client: ', clientId);
      }
      ```

16. Now try to import the above function in `apps/api/src/app/app.service.ts`
    - Try to lint all the apps
    - It should work because everything is in the `api` scope
      <br /> <br />
17. Try to import it in `apps/store/src/app/app.component.ts`
    - It should fail because it's not within the same scope
      <br /> <br />
18. In `libs/api/util-notifications/src/lib/api-util-notifications.ts`
    - Try to import a `feature` lib
    - It should correctly fail because the type hierarchy is not respected
      <br /> <br />
19. **BONUS -** A `generator.spec.ts` file was created when we ran our generator. Try writing some meaningful tests for this generator.
    <br /> <br />

20. **BONUS BONUS** - try to create another similar generator, but for "feature" libs.
    <br /> <br />

21. Commit everything before the next lab.
    <br /> <br />

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab14/LAB.md)
