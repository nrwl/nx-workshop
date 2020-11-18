import { text, number, boolean } from '@storybook/addon-knobs';
import { HeaderComponent } from './header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import '@angular/material/prebuilt-themes/deeppurple-amber.css';

export default {
  title: 'HeaderComponent',
};

export const primary = () => ({
  moduleMetadata: {
    imports: [MatToolbarModule],
  },
  component: HeaderComponent,
  props: {
    title: text('title', ''),
  },
});
