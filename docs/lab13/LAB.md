### 🧸️ Lab 13 - Workspace schematics - Intro

###### ⏰ Estimated time: 20-25 minutes

#### 📚 Learning outcomes:

- Understand what workspace schematics are
- How to create them
- How to invoke them 
- How to use one to simplify usages of other, more powerful schematics

#### 🏋️‍♀️ Steps :

We just learned how important tags are. But we don't want to constantly and manually 
have to maintain them. In this workshop, we'll create a custom workspace schematic
called `util-lib` that knows about the folders in our workspace and automatically tags the new project
with a correct scope and type tag.

1. Use the `@nrwl/workspace:workspace-schematic` schematic to generate a new
workspace schematic called `util-lib`

2. Commit everything (you'll see in a bit why).

2. Inspect the files that got generated and try to run your schematic.

   <details>
   <summary>🐳 Hint</summary>

   Inspect the [Workspace schematics docs](https://nx.dev/latest/angular/workspace/schematics/workspace-schematics#workspace-schematics)
   for details on how to run it.

   </details>
   
   ⚠️ It invokes the `@nrwl/workspace:lib` schematic by default. So it should generate some files when you run it.
   You can use Git to undo those changes (hence why it's recommended to commit before running a schematic).

3. In `tools/schematics/util-lib/index.ts` try to make it `console.log()` the value of the `--name` property you passed to it.

4. Now that we're more familiar with how command line options are passed to the schematic,
**let's revert all locally generated files**, as we're about to start making actually useful changes to the schematic.

2. Add a new property to its schema called `directory`. It should have only 3 possible values:
`"store", "api", "shared"`. If you do not pass `--directory` as an option when invoking the
schema it should prompt the user to select from the 3 different values (similar to when you got 
asked about which CSS framework to use when creating Angular libs).

   <details>
   <summary>🐳 Hint</summary>

   [Adding dynamic prompts](https://nx.dev/latest/angular/workspace/schematics/workspace-schematics#adding-dynamic-prompts)

   </details>

3. Have the schematic automatically pass the `--linter=tslint` option, so the developer doesn't have
to pass it each time they invoke the schematic.

    ⚠️ Continue referring to the doc page linked in the above hints
    
3. The schematic should prefix any name you give to your lib with `util-`
    
    For example: 
    - `nx workspace-schematic util-lib dates`
    - Should generate a lib with the name `util-dates`
    
3. The schematic should generate the lib in the directory you pass to it.

4. Because it's a `util` lib, it should automatically be generated with the `type:util` tags.

   <details>
   <summary>🐳 Hint</summary>
   
   Consult the `@nrwl/workspace:lib` [docs](https://nx.dev/latest/angular/plugins/workspace/schematics/library)
   for possible options you can pass to it.

   </details>

5. We also need to add `scope` tag to it. We can use the `directory` value for this.

6. Before testing your changes, remember to commit them, in case you need to revert
locally generated files again.

4. Invoke your schematic and test if the above requirements work
    - Let's give it the name `notifications`
    - Select `api` as the directory

6. Let's add some functionality to the lib you just created:
    - In `libs/api/util-notifications/src/lib/api-util-notifications.ts`
    - Add:
   
        ```
       export function sendNotification(clientId: string) {
         console.log("sending notification to client: ", clientId);
       }
       ```

7. Now try to import the above function in `apps/api/src/app/app.service.ts`
    - Try to lint all the apps
    - It should work because everything is in the `api` scope
    
8. Try to import it in `apps/store/src/app/app.component.ts`
    - It should fail because it's not within the same scope
    
9. In `libs/api/util-notifications/src/lib/api-util-notifications.ts`
    - Try to import a `feature` lib
    - It should correctly fail because the type hierarchy is not respected
    
10. **BONUS -** Currently, the schema passed to the schematic is of type `any` - `tools/schematics/util-lib/index.ts`
Try to create an interface for it that respects the schematic's schema.

11. **BONUS BONUS** - try to create another similar schematic, but for "feature" libs.

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab14/LAB.md)
