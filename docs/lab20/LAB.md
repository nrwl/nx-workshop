# 🎸 Lab 20 - Connecting the frontend and backend

###### ⏰ Estimated time: 5 minutes

<br />

## 📚 Learning outcomes:

- **Configure the Angular app for production**
  <br /><br /><br />

## 🏋️‍♀️ Steps:

When we serve the Store and API locally, they work great, because of the configured
proxy discussed in previous labs. The Store will think the API lives at the same address.

When deployed separately however, they do not yet know about each other. Let's configure
a production URL for the API.

1. In `apps/store/src/environments/environment.prod.ts` change it to:

   ```ts
   export const environment = {
     production: true,
     apiUrl: 'https://<your-heroku-app-name>.herokuapp.com',
   };
   ```

   <br />

2. In `apps/store/src/environments/environment.ts`:

   ```ts
   export const environment = {
     production: false,
     apiUrl: '',
   };
   ```

   <br />

3. In `apps/store/project.json`:

   ```jsonc
   {
     //...
     "targets": {
       //...
       "build": {
         //...
         "configurations": {
           "production": {
             //...
             // Add this property:
             "fileReplacements": [
               {
                 "replace": "apps/store/src/environments/environment.ts",
                 "with": "apps/store/src/environments/environment.prod.ts"
               }
             ]
           }
         }
       }
     }
   }
   ```

   <br />

4. In `apps/store/src/app/app.module.ts`:
   - `import { environment } from '../environments/environment';`
   - Add a new provider:
     `ts providers: [{ provide: 'baseUrl', useValue: environment.apiUrl }], `
     <br /> <br />
5. In `apps/store/src/app/app.component.ts`, inject your new token:

   ```ts
   constructor(private http: HttpClient, @Inject('baseUrl') private baseUrl: string) {}
   ```

   Then use it:

   ```ts
   games = this.http.get<Game[]>(`${this.baseUrl}/api/games`);
   ```

    <br />

6. In `libs/store/feature-game-detail/src/lib/game-detail/game-detail.component.ts`

   - Inject it in the constructor: `@Inject('baseUrl') private baseUrl: string`
   - Use it:
     ```typescript
     this.http.get<Game>(`${this.baseUrl}/api/games/${id}`);
     ```
       <br />

7. Build the Store for production and trigger a deployment
   <br /> <br />

8. Go to your Surge deployment URL - you should now see the full app with all the games.
   <br /> <br />

---

[➡️ Next lab ➡️](../lab21/LAB.md)
