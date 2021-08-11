# 💻 Lab 8 - Displaying a full game in the routed game-detail component

###### ⏰ Estimated time: 15-20 minutes
<br />

Now we have a proper API that we can use to make HTTP requests. We'll look at how the Nrwl NestJS generators created a helpful proxy configuration for us.
<br /><br />

## 📚 Learning outcomes:

- **Learn how to connect frontend and backend apps in an Nx workspace**
<br /><br /><br />

## 📲 After this workshop, you should have:

<details>
  <summary>App screenshot</summary>
  <img src="../assets/lab8_screenshot.png" width="500" alt="screenshot of lab8 result">
</details>
<br />

## 🏋️‍♀️ Steps:

1. **Import the `HttpClientModule`** in `apps/store/src/app.module.ts` and add it to the module's imports array:

   <details>
   <summary>🐳 Hint</summary>

   ```ts
   import { HttpClientModule } from '@angular/common/http';
   ```

   </details>
   <br />

2. Within the same folder, **inject the `HttpClient`** in the [app.component.ts](../../examples/lab8/apps/store/src/app/app.component.ts)'s constructor and **call your new API** as an _HTTP request_

   ⚠️ _Notice how we assume it will be available at `/api` (more on that below)_
   <br /><br />

4. Because our list of `games` is now an Observable, we need to **add an `async` pipe** in the template that gets the games:

   <details>
   <summary>🐳 Hint</summary>

   ```html
   <mat-card
     class="game-card"
     *ngFor="let game of games | async" <-- HERE
     [routerLink]="['/game', game.id]"
     >...</mat-card
   >
   ```

   </details>
   <br />

5. **Run `nx serve api`**

   ⚠️ Notice the _PORT_ number
   <br /><br />

6. In a different tab, **run `nx serve store`**

   ⚠️ Again, notice the _PORT_ number
   <br /><br />

7. Everything should still look/function the same!
   
   🎓 You can inspect your Network tab in the dev tools and notice an XHR request made to `http://localhost:4200/api/games`
   <br /><br />

---

🎓 Even though the frontend and server are being exposed at different ports, we can call `/api` from the frontend store because `Nx` created a proxy configuration for us (see `apps/store/proxy.conf.json`) so any calls to `/api` are being routed to the correct address/port where the API is running.
This helps you avoid CORS issues while developing locally.

---

Now let's load the full game in our routed component!

8. Inside the `libs/store/feature-game-detail/src/lib` folder, **replace the following files**:

   - `/game-detail/game-detail.component.` [ts](../../examples/lab8/libs/store/feature-game-detail/src/lib/game-detail/game-detail.component.ts) / [html](../../examples/lab8/libs/store/feature-game-detail/src/lib/game-detail/game-detail.component.html)
   - [/store-feature-game-detail.module.ts](../../examples/lab8/libs/store/feature-game-detail/src/lib/store-feature-game-detail.module.ts)

   ⚠️ Notice how we're using the shared `formatRating()` function in our routed component as well!
   <br /><br />

9. Your component should look similar to the provided screenshot! (you might need to restart your `nx serve store` so the new button styles can be copied over)
   <br /><br />
10. **Inspect what changed** from the last time you committed, then **commit your changes**
   <br /><br />

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab9/LAB.md)
