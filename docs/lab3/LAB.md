# 💻 Lab 3 - Executors

###### ⏰ Estimated time: 5-15 minutes

<br />

We'll build the app we just created, and look at what executors are and how to customize them.

<br /><br />

## 📚 Learning outcomes:

- **Understand what a `target` and `executor` are**
- **Learn how to invoke executors**
- **Configure executors by passing them different options**
- **Understand how an executor can invoke another executor**
  <br /><br /><br />

## 📲 After this workshop, you should have:

<details>
  <summary>App Screenshot</summary>
  <img src="../assets/lab3_screenshot.png" width="500" alt="screenshot of lab3 result">
</details>

<details>
  <summary>File structure</summary>
  <img src="../assets/lab3_directory-structure.png" height="700" alt="lab3 file structure">
</details>

## 🏋️‍♀️ Steps:

1. **Build the app**

   <details>
   <summary>🐳 Hint</summary>
   <img src="../assets/lab3_build_cmds.svg" alt="Nx executor command structure">
   </details>
   <br />

2. You should now have a `dist` folder - let's **open it up**!
   - This is your whole app's output! If we wanted we could push this now to a server and it would all work.
     <br /> <br />
3. **Open up `apps/store/project.json`** and look at the object under `targets/build`
   - this is the **target**, and it has a **executor** option, that points to `@angular-devkit/build-angular:browser`
   - Remember how we copied some images into our `/assets` folder earlier? Look through the executor options and try to find how it knows to include them in the final build!
     <br /> <br />
4. Notice the `defaultConfiguration` executor option is pointing to `production`. This means it applies all the prod optimisations to our outputs, as per the `production` configuration in `project.json`. **Send a flag to the executor** so that it builds for development instead.

   <details>
   <summary>🐳 Hint</summary>

   `--configuration=development`

   </details>
   <br />

5. **Open up the `dist` folder** again - notice how all the file names have no hashes, and the contents themselves are human readable.
   <br /> <br />
6. **Modify `project.json`** and instruct the executor to import the Angular Material styles: `./node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css`

   <details>
    <summary>🐳 Hint</summary>
    
    Add it to: `"styles": ["apps/store/src/styles.css"]`
   </details>

   🎓Notice how we can configure executors by either modifying their options in `project.json` (this step) or through the command line (step 4)!
   <br /> <br />

7. The **serve** target (located a bit lower in `project.json`) also contains a executor, that _uses_ the output from the **build** target we just changed
   (see `serve --> options --> browserTarget` --> it points to the `build` target of the `store` project)
   - so we can just re-start `nx serve store` see the new styles you added!
     <br /> <br />
8. **Inspect what changed** from the last time you committed, then **commit your changes**
   <br /> <br />

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab3.1/LAB.md)
