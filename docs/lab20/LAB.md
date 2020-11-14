### 💻 Lab 20 - Connecting the frontend and backend

###### ⏰ Estimated time: 5-10 minutes

#### 📚 Learning outcomes:

- Understand how to bootstrap a new Nx workspace

#### 🏋️‍♀️ Steps :

1. In `apps/store/src/environments/environment.prod.ts` add:

```
export const environment = {
  production: true,
  apiUrl: 'https://<your-heroku-app-name>.herokuapp.com'
};
```

2. In `apps/store/src/environments/environment.ts`:

```
export const environment = {
  production: false,
  apiUrl: ''
};
```

3. In `apps/store/src/app/app.module.ts`:
    - `import { environment } from '../environments/environment';`
    - Add a new provider:
     ```
    providers: [{
        provide: 'baseUrl',
        useValue: environment.apiUrl
      }],
    ```
   
4. In `apps/store/src/app/app.component.ts` - inject your new token:
    
    ```
   constructor(private http: HttpClient, @Inject('baseUrl') private baseUrl: string) {}
   ```
   
   Then use it:
   
   ```
    games = this.http.get<Game[]>(${this.baseUrl}/api/games);
    ```

5. In `libs/store/feature-game-detail/src/lib/game-detail/game-detail.component.ts`:
    - Inject it in the constructor: `@Inject('baseUrl') private baseUrl: string`
    - Use it: `this.http.get<Game>(${this.baseUrl}/api/games/${id})`

6. Deploy the store:

```
nx build store --configuration=production
nx deploy store
```

7. Go to your Surge deployment URL - you should now see the games

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab21/LAB.md)
