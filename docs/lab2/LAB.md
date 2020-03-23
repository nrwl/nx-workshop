### 💻 Lab 2 - Generate an Angular app

###### ⏰ Estimated time: 15-20 minutes

TODO: add link to repo

Before starting this lab, you can clone our Git repository (`master` branch will be starting point) or continue with the one you created.

In this lab we'll generate our first Angular application within the new monorepo.

#### 📚 Learning outcomes:

- Get familiar with generating new apps within your workspace using the Nx CLI

#### 📲 After this workshop, your app should look similar to this:

<details>
  <summary>App Screenshot</summary>
  <img src="../assets/lab2_result.png" width="500" alt="screenshot of lab2 result">
</details>

<details>
  <summary>File structure</summary>
  <img src="../assets/lab2_file_structure.png" height="700" alt="lab2 file structure">
</details>

#### 🏋️‍♀️ Steps:

1. Make sure you can run Nx commands:
   - install the CLI globally: `npm i -g @nrwl/cli`
   - if you don't want to install it globally, use `yarn nx` instead of `nx` in all the commands below
2. Run `nx list` to see which plugins you have installed
3. Add the Angular plugin: `yarn add @nrwl/angular`
4. Let's also add Angular Material so we can use some of their components: `yarn add @angular/material @angular/cdk`
5. Use the [`@nrwl/angular` plugin](https://nx.dev/angular/api/angular/schematics/application) to generate an Angular app called `store` in your new workspace

   ⚠️**Important:** Make sure you **enable routing** when asked!

   <details>
   <summary>🐳 Hint</summary>
   <img src="../assets/lab2_cmds.png" alt="Nx generate cmd structure">
   </details>

6. Create a `fake-api.ts` file in your new app that returns an array of some games (you can just copy the code from [here](https://github.com/rarmatei/nx-workshop/tree/master/examples/lab2/apps/frontend/src/fake-api/index.ts))
   ⏳**Reminder:** When you are given example files to copy, the folder they're in hints to the _folder_ and _filename_ you can place them in when you do the copying
7. Add some basic styling to your new component and display the games from the Fake API (to not spend too much time on this, you can copy it from here [.html](https://github.com/rarmatei/nx-workshop/tree/master/examples/lab2/apps/frontend/src/app/app.component.html) / [.css](https://github.com/rarmatei/nx-workshop/tree/master/examples/lab2/apps/frontend/src/app/app.component.css) / [.ts](https://github.com/rarmatei/nx-workshop/tree/master/examples/lab2/apps/frontend/src/app/app.component.ts) - and replace the full contents of the files)
8. You can get the example game images from [here](https://github.com/rarmatei/nx-workshop/tree/master/examples/lab2/apps/frontend/src/assets)
9. Add the Material Card Module to `app.module.ts`:
   `import { MatCardModule } from '@angular/material/card';`
10. Serve the app: `nx serve store`
11. See your app live at: `http://localhost:4200/`

---

Your app should look similar to the screenshot above!

Now we're starting to see some content! But there are some styles missing: the Angular Material theme! We'll look at how to add it in the next workshop!

The ratings also don't look that good - we'll fix those in **Lab 5**.

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab3/LAB.md)
