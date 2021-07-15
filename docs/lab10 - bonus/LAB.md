# 💻 Lab 10 - Generate Storybook stories for the shared ui component

###### ⏰ Estimated time: 10-15 minutes
<br />

Let's explore some more Nx plugins by generating and running a storybook configuration for our shared store header.
<br /><br />

## 📚 Learning outcomes:

- **Explore other Nx plugins to create a storybook configuration**
<br /><br /><br />

## 📲 After this workshop, you should have:

<details>
  <summary>App Screenshot</summary>
  No change in how the app looks!
</details>

<details>
  <summary>File structure</summary>
  <img src="../assets/lab10_directory-structure.png" height="700" alt="lab10 file structure">
</details>
<br />

## 🏋️‍♀️ Steps:

1. **`yarn add @nrwl/storybook`**
   <br /><br />
2. Use the `@nrwl/angular:storybook-configuration` generator to **generate a storybook configuration** for the `store-ui-shared` project

   ⚠️ Answer **YES** to all questions
   <br /><br />
3. Inside `libs/store/ui-shared/src/lib/header/header.component.stories.ts`:

   - **Import the `MatToolbarModule`**
   - **Import the Angular Material Theme**

   <details>
   <summary>🐳 Hint</summary>

   ```ts
   //IMPORT TOOLBAR MODULE
   import { MatToolbarModule } from '@angular/material/toolbar';

   //IMPORT THEME
   import '@angular/material/prebuilt-themes/deeppurple-amber.css';

   //......

   export const primary = () => ({
     moduleMetadata: {
       imports: [MatToolbarModule] // <-- import the module
     }
     //...
   });
   ```

   </details>
   <br />

4. **Serve storybook!**

   <details>
   <summary>🐳 Hint</summary>

   `nx storybook store-ui-shared`

   </details>
   <br />

5. Start typing in different titles and **see how they appear** in the header

   <img src="../assets/storybook.gif" width="300" alt="the header component running in storybook">
   <br /><br />

6. **Inspect what changed** from the last time you committed, then **commit your changes**
   <br /><br />

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab11%20-%20bonus/LAB.md)
