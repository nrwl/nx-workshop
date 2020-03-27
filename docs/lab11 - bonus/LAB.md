### 💻 Lab 11 - e2e test the shared component

###### ⏰ Estimated time: 5 minutes

The storybook schematic we ran earlier also generated some e2e tests. Let's try them out!

#### 📚 Learning outcomes:

- Take advantage of the e2e tests Nx generated earlier to test your app

#### 🏋️‍♀️ Steps:

1. Our previous command generated a new `apps/store-ui-shared-e2e` folder. Let's run them: `nx e2e store-ui-shared-e2e`
   - The tests should pass!
2. Open `apps/store-ui-shared-e2e/src/integration/header/header.component.spec.ts` and give the title a value:

   ```ts
   cy.visit(
     '/iframe.html?id=headercomponent--primary&knob-title=BoardGameHoard'
   );
   ```

3. Now add a test to check if it contains that value

   ```ts
   it('should show the title', () => {
     cy.get('bg-hoard-header').contains('BoardGameHoard');
   });
   ```

4. Re-run the tests
5. Inspect what changed from the last time you committed, then commit your changes
