### 💻 Lab 13 - Workspace schematics - Intro

###### ⏰ Estimated time: 5-10 minutes

#### 📚 Learning outcomes:

- Understand what workspace schematics are
- How to create one
- How to invoke them 
- How to simplify usage of an external lib

#### 🏋️‍♀️ Steps :

1. Generate a workspace schematic:

    ```
    nx generate @nrwl/workspace:workspace-schematic util-lib
    ```

2. Add a new property to its schema:

    ```
    "directory": {
          "type": "string",
          "description": "The scope of your lib.",
          "x-prompt": "Which directory do you want the lib to be in?",
          "enum": [
            "store",
            "api",
            "none"
          ]
        }
    ```

3. Have it invoke the `@nrwl/workspace:lib` schematic: 

    ```
    import { chain, externalSchematic, Rule } from '@angular-devkit/schematics';
    
    export default function(schema: any): Rule {
      return chain([
        externalSchematic('@nrwl/workspace', 'lib', {
          name: `util-${schema.name}`,
          linter: 'tslint',
          directory: schema.directory === 'none' ? '' :  schema.directory,
          tags: `type:util', scope:${schema.directory}`
        })
      ]);
    }
    ```

4. Let's invoke it: `nx workspace-schematic util-lib notifications`

5. Select `api` as the directory

6. Now let's add some functionality to it
    - In `libs/api/util-notifications/src/lib/api-util-notifications.ts`
    - Add:
    
    ```
   export function sendNotification(clientId: string) {
     console.log("sending notification to client: ", clientId);
   }
   ```

7. Now try to import the above function in `apps/api/src/app/app.service.ts`
    - It should work because it is now scoped to `api`

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab14/LAB.md)
