### 💻 Lab 3 - Executors

###### ⏰ Estimated time: 5-15 minutes

We'll build the app we just created, and look at what executors are and how to customize them.

#### 📚 Learning outcomes:

- Understand what a `target` and `executor` are
- Invoking executors
- Configure executors by passing them different options
- Understand how an executor can invoke another executor

#### 📲 After this workshop, you should have:

<details>
  <summary>App Screenshot</summary>
  <img src="../assets/lab3_screenshot.png" width="500" alt="screenshot of lab3 result">
</details>

<details>
  <summary>File structure</summary>
  <img src="../assets/lab3_directory-structure.png" height="700" alt="lab3 file structure">
</details>

#### 🏋️‍♀️ Steps:

1. Build the app

   <details>
   <summary>🐳 Hint</summary>
   <img src="../assets/lab3_build_cmds.png" alt="Nx executor command structure">
   </details>

2. You should now have a `dist` folder - let's open it up!
   - This is your whole app's output! If we wanted we could push this now to a server and it would all work.
3. Open up `workspace.json` and look at the object under `projects/store/targets/build`
   - this is the **target**, and it has a **executor** option, that points to `@angular-devkit/build-angular:browser`
   - Remember how we copied some images into our `/assets` folder earlier? Look through the executor options and try to find how it knows to include them in the final build!
4. Send a flag to the executor so that it builds for production

   <details>
   <summary>🐳 Hint</summary>

   `--configuration=production`

   </details>

5. Open up the `dist` folder again - notice how we now generated a `3rdpartylicenses.txt` file, as per the "production" configuration in `workspace.json`
6. Modify `workspace.json` and instruct the executor to import the Angular Material styles: `./node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css` (and add it to the module's imports)

   <details>
    <summary>🐳 Hint</summary>
    
    Add it to: `"styles": ["apps/store/src/styles.css"]`
   </details>

   🎓Notice how we can configure executors by either modifying their options in `workspace.json` (this step) or through the command line (step 4)!

7. The **serve** target (located a bit lower in `workspace.json`) also contains a executor, that _uses_ the output from the **build** target we just changed
   - so we can just re-start `nx serve store` see the new styles you added!
8. Inspect what changed from the last time you committed, then commit your changes

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab4/LAB.md)
