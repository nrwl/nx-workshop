### 💻 Lab 9 - Generate a type lib that the API and frontend can share

###### ⏰ Estimated time: 15 minutes

Now our dependency graph looks a bit disconnected. The frontend and the API still do not have anything in common. The power of Nx libraries is that they can be shared among any number of projects.

We'll look at creating libs to store Typescript interfaces and then we'll use the Nx **Move** schematic to move that library around our project, with minimal effort.

#### 📚 Learning outcomes:

- Explore other real-world examples of creating shared libs for a specific project
- Learn to use the `move` schematic

#### 📲 After this workshop, you should have:

<details>
  <summary>App Screenshot</summary>
  No change in how the app looks!
</details>

<details>
  <summary>File structure</summary>
  <img src="../assets/lab9_directory-structure.png" height="700" alt="lab9 file structure">
</details>

#### 🏋️‍♀️ Steps:

1. Stop serving both the API and the frontend

2. Generate a new `@nrwl/workspace` lib called `util-interface` inside the `libs/api` folder

   ⚠️ It's **important** that we create it in the `/api` folder for now

3. Create your `Game` interface: see `libs/api/util-interface/src/lib/`[util-interface.ts](../../examples/lab9/libs/api/util-interface/src/lib/util-interface.ts)
4. Import it in the API service: `apps/api/src/app/app.service.ts`

   ⚠️ You might need to restart the Typescript compiler in your editor

   <details>
   <summary>🐳 Hint</summary>

   ```typescript
   import { Game } from '@bg-hoard/api/util-interface';
   const games: Game[] = [...];
   ```

   </details>

5. Build the API and make sure there are no errors

   <details>
   <summary>🐳 Hint</summary>

   ```shell
   nx build api
   ```

   </details>

6. Inspect the dependency graph

---

Our frontend store makes calls to the API via the `HttpClient` service:

```typescript
this.http.get<any>(`/api/games/${id}`);
```

But it's currently typed to `any` - so our component has no idea about the shape of the objects it'll get back!

Let's fix that - we already have a `Game` interface in a lib. But it's nested in the `api` folder - we need to move it out to the root `libs/` folder so any project can use it!

---

7.  Use the `@nrwl/workspace:move` schematic to move the interface lib created above into the root `/libs` folder

    ⚠️ Make sure you use the `--dry-run` flag until you're confident your command is correct

    <details>
    <summary>🐳 Hint 1</summary>
    <img src="../assets/lab2_cmds.png" alt="Nx generate cmd structure">
    </details>

    <details>
    <summary>🐳 Hint 2</summary>

    Use the `--help` command to figure out how to target a specific **project**
    Alternatively, check out the [docs](https://nx.dev/angular/api/workspace/schematics/move)

    </details>

    <details>

    <summary>🐳 Hint 3</summary>

    Your library name is `api-util-interface` - to move it to root, its new name needs to be `util-interface`

    </details>

8.  We can now import it in the frontend components and use it when making the `http` request:

    <details>
    <summary>🐳 Hint</summary>

    Frontend store shell app: `apps/store/src/app/app.component.ts`

    ```typescript
    import { Game } from '@bg-hoard/util-interface';

    this.http.get<Game[]>('/api/games');
    ```

    ***

    Routed game detail component: `libs/store/feature-game-detail/src/lib/game-detail/game-detail.component.ts`

    ```typescript
    this.http.get<Game>(`/api/games/${id}`);
    ```

    </details>

    ⚠️ Notice how we didn't have to update the imports in the API. The `move` schematic took care of that for us!

9.  Trigger a build of both the store and the API projects and make sure it passes
10. Inspect the dependency graph
11. Inspect what changed from the last time you committed, then commit your changes

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab10%20-%20bonus/LAB.md)
